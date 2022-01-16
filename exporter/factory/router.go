package factory

import (
	"sync"
	"time"

	"github.com/filouz/rnbb/exporter/cases"
	"github.com/filouz/rnbb/exporter/pb"
	"github.com/filouz/rnbb/exporter/utils"
	"go.uber.org/zap"
)

// Route struct for handling individual route connections.
type Route struct {
	rid      int             // The unique identifier for this route
	outgoing chan *pb.Packet // Channel for outgoing packets
	incoming chan *pb.Packet // Channel for incoming packets

	outgoingLock sync.Mutex // Lock to ensure thread-safe access to outgoing packets

	currentCase cases.Case // The currently executing case
}

// handleStart processes a start request.
func (r *Route) handleStart(req *pb.RnRequest) {

	var cCase cases.Case
	var packet *pb.Packet

	// Depending on the requested case, instantiate the corresponding case and packet.
	switch req.Case {
	case pb.RequestCase_D2D6:
		cCase, packet = cases.NewCaseDices()
	case pb.RequestCase_FLIP:
		cCase, packet = cases.NewCaseFlip()
	case pb.RequestCase_MINT:
		cCase, packet = cases.NewCaseMint()

	}

	r.currentCase = cCase
	r.outgoing <- packet
}

// handleStop processes a stop request.
func (r *Route) handleStop(req *pb.RnRequest) {
	packet, err := r.currentCase.Stop(int(req.StopLimit))
	if err != nil {
		utils.Logger.Error("Failed to process STOP request", zap.Error(err))
		return
	}
	r.currentCase = nil
	r.outgoing <- packet
}

// handleCancel processes a cancel request.
func (r *Route) handleCancel(req *pb.RnRequest) {

	if r.currentCase != nil {

		packet := r.currentCase.Cancel()

		r.currentCase = nil

		r.outgoing <- packet
	}
}

// open starts the route's main event loop, processing incoming packets.
func (r *Route) open() {
	for cmd := range r.incoming {
		r.outgoingLock.Lock()

		// Process the command based on its type.
		switch req := cmd.GetStartNstop(); req.Type {
		case pb.RequestType_CANCEL:
			r.handleCancel(req)
		case pb.RequestType_START:
			r.handleStart(req)
		case pb.RequestType_STOP:
			r.handleStop(req)
		}

		r.outgoingLock.Unlock()
	}
}

// consume handles a new transaction for the route's current case.
func (r *Route) consume(tx *pb.Transaction) {
	if r.currentCase != nil {
		r.outgoing <- r.currentCase.AppendTransaction(tx)
	}
}

// close safely closes the incoming and outgoing channels.
func (r *Route) close() {
	close(r.incoming)
	close(r.outgoing)
}

// Router struct for managing multiple routes.
type Router struct {
	incoming chan *pb.Transaction // Channel for incoming transactions

	nextRid int            // Next route ID to assign
	routes  map[int]*Route // Current routes being managed

	incomingLock sync.Mutex // Lock to ensure thread-safe access to incoming transactions
}

// NewRouter creates and starts a new router instance.
func NewRouter() *Router {
	rr := &Router{
		nextRid:  1,
		routes:   make(map[int]*Route),
		incoming: make(chan *pb.Transaction, 100), // arbitrary buffer size, you can adjust as needed
	}

	go rr.dispatch()

	return rr
}

// receiveTx adds a new transaction to the incoming channel.
func (rr *Router) receiveTx(txHash string) {
	rr.incoming <- &pb.Transaction{
		Hash:      txHash,
		Timestamp: time.Now().UnixMilli(),
	}
}

// NewRoute creates a new route and adds it to the router's managed routes.
func (rr *Router) NewRoute() (rid int, toSend chan *pb.Packet, receive func(*pb.Packet)) {
	toSend = make(chan *pb.Packet)

	rid = rr.nextRid
	rr.nextRid = rid + 1

	route := &Route{
		rid:      rid,
		outgoing: toSend,
		incoming: make(chan *pb.Packet, 1),
	}

	rr.routes[rid] = route

	receive = func(p *pb.Packet) {
		route.incoming <- p
	}

	go route.open()

	return rid, toSend, receive
}

// dispatch starts the router's main event loop, dispatching transactions to routes.
func (rr *Router) dispatch() {
	defer func() {
		if r := recover(); r != nil {
			utils.Logger.Info("Recovered from panic in dispatch:", zap.Any("obj", r))
		}
	}()

	for tx := range rr.incoming {
		utils.Logger.Debug("processing tx", zap.Any("tx", tx))

		rr.incomingLock.Lock()
		for _, route := range rr.routes {
			route.consume(tx)
		}
		rr.incomingLock.Unlock()
	}
}

// disconnect removes a route from the router's managed routes.
func (rr *Router) disconnect(rid int) {
	route, ok := rr.routes[rid]
	if ok {
		route.close()
		delete(rr.routes, rid)
	}
}

// Close stops the router and all managed routes.
func (rr *Router) Close() {
	rr.incomingLock.Lock()
	defer rr.incomingLock.Unlock()

	for rid, _ := range rr.routes {
		rr.disconnect(rid)
	}
	close(rr.incoming)
}
