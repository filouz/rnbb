package factory

import (
	"context"
	"encoding/hex"
	"log"
	"net/http"

	"github.com/filouz/rnbb/exporter/protostream"
	"github.com/filouz/rnbb/exporter/utils"
	"go.uber.org/zap"

	"github.com/zeromq/goczmq"
	"nhooyr.io/websocket"

	"github.com/filouz/rnbb/exporter/pb"
)

type Handler struct {
	router *Router
}

func NewHandler() Handler {
	return Handler{
		router: NewRouter(),
	}
}

func (h Handler) StartTxListener(zmqEndpoint string) {

	sock, err := goczmq.NewSub(zmqEndpoint, "hashtx") // "rawblock,rawtx,hashtx,hashblock"
	if err != nil {
		log.Fatal(err)
	}
	defer sock.Destroy()

	utils.Logger.Info("Established ZMQ connection", zap.String("endpoint", zmqEndpoint))

	for {
		message, err := sock.RecvMessage()
		if err != nil {
			utils.Logger.Debug("Failed to receive transaction", zap.Error(err))
			continue
		}
		if len(message) != 3 {
			utils.Logger.Warn("Failed to process tx", zap.Int("expected length", 3), zap.ByteStrings("tx", message))
			continue
		}

		utils.Logger.Debug("tx received ", zap.ByteStrings("tx", message), zap.Binary("0", message[0]), zap.Binary("1", message[1]), zap.Binary("2", message[2])) // hex.EncodeToString
		h.router.receiveTx(hex.EncodeToString(message[1]))

	}
}

func (h Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) { // exec/conn
	con, err := websocket.Accept(w, r, &websocket.AcceptOptions{
		OriginPatterns: []string{"*"},
	})

	if err != nil {
		utils.Logger.Error("Failed to upgrade websocket", zap.Error(err))
		return
	}
	defer con.Close(websocket.StatusNormalClosure, "closed")

	stream := protostream.NewProtoStream(r.Context(), con)

	ctx, cancel := context.WithCancel(r.Context())

	rid, toSend, receive := h.router.NewRoute()

	defer h.router.disconnect(rid)

	go func() {
		defer cancel()
		for packet := range toSend {
			var err = stream.Send(packet)
			if err != nil {
				utils.Logger.Error("Failed to send packet", zap.Error(err))
				return
			}
			utils.Logger.Info("Sending package", zap.Int("rid", rid), zap.Any("packet", packet))
		}
	}()

	go func() {
		defer cancel()
		for {
			packet := &pb.Packet{}
			var err = stream.Recv(packet)
			if err != nil {
				if websocket.CloseStatus(err) != websocket.StatusNormalClosure {
					utils.Logger.Error("Failed to receive packet", zap.Error(err))
				}
				return
			}
			utils.Logger.Info("Receiving package", zap.Int("rid", rid), zap.Any("packet", packet))
			receive(packet)

		}
	}()

	<-ctx.Done()
}
