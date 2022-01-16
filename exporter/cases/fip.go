package cases

import (
	"fmt"
	"strings"
	"time"

	"github.com/filouz/rnbb/exporter/pb"
	"github.com/filouz/rnbb/exporter/utils"
)

type Flip struct {
	State
}

func NewCaseFlip() (*Flip, *pb.Packet) {

	state := State{
		StartTimestamp: time.Now(),
		Transactions:   []*pb.Transaction{},
	}

	return &Flip{state}, &pb.Packet{
		Response: &pb.Packet_Ack{
			Ack: &pb.Ack{
				ReqAck: pb.RequestType_START,
			},
		},
	}
}

func (d *Flip) Stop(limit int) (*pb.Packet, error) {

	if limit > len(d.Transactions) {
		return nil, fmt.Errorf("not enough transactions")
	}

	stopTimestamp := time.Now()
	txHashList := []string{}
	for _, tx := range d.Transactions {
		txHashList = append(txHashList, tx.Hash)
	}
	txHashListJoined := strings.Join(txHashList, ",")

	details := &pb.RnDetails{
		Type:           pb.RequestCase_D2D6,
		TxSize:         int64(len(d.Transactions)),
		StartTimestamp: d.StartTimestamp.UnixMilli(),
		StopTimestamp:  stopTimestamp.UnixMilli(),
		ElapsedTime:    stopTimestamp.Sub(d.StartTimestamp).Milliseconds(),
		Txs:            d.Transactions,
		TxsHash:        utils.Hash256(txHashListJoined),
		Seed:           utils.CalcSeed(txHashListJoined),
	}

	return &pb.Packet{
		Response: &pb.Packet_DemoFlip{
			DemoFlip: &pb.DemoFlip{
				Details: details,
				Head:    utils.RandomNumber(fmt.Sprintf("/%v/1", txHashListJoined), 2) == 1,
			},
		},
	}, nil
}

func (d *Flip) Cancel() *pb.Packet {
	return &pb.Packet{
		Response: &pb.Packet_Ack{
			Ack: &pb.Ack{
				ReqAck: pb.RequestType_CANCEL,
			},
		},
	}
}

func (d *Flip) AppendTransaction(tx *pb.Transaction) *pb.Packet {

	d.Transactions = append(d.Transactions, tx)

	return &pb.Packet{
		Response: &pb.Packet_Size{
			Size: &pb.TxSize{
				Length: int64(len(d.Transactions)),
			},
		},
	}
}
