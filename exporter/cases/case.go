package cases

import (
	"time"

	"github.com/filouz/rnbb/exporter/pb"
)

type Case interface {
	Stop(limit int) (*pb.Packet, error)
	Cancel() *pb.Packet
	AppendTransaction(tx *pb.Transaction) *pb.Packet
}

type State struct {
	StartTimestamp time.Time

	Transactions []*pb.Transaction
}
