package cases

import (
	"time"

	"github.com/filouz/rnbb/exporter/pb"
)

type Mint struct {
	State
}

func NewCaseMint() (*Mint, *pb.Packet) {

	state := State{
		StartTimestamp: time.Now(),
		Transactions:   []*pb.Transaction{},
	}

	return &Mint{state}, &pb.Packet{
		Response: &pb.Packet_Ack{
			Ack: &pb.Ack{
				ReqAck: pb.RequestType_START,
			},
		},
	}
}

func (d *Mint) Stop(limit int) (*pb.Packet, error) {

	// todo

	return nil, nil
}

func (d *Mint) Cancel() *pb.Packet {
	// todo

	return nil
}

func (d *Mint) AppendTransaction(tx *pb.Transaction) *pb.Packet {

	// todo

	return nil
}
