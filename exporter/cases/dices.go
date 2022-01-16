package cases

import (
	"fmt"
	"strings"
	"time"

	"github.com/filouz/rnbb/exporter/pb"
	"github.com/filouz/rnbb/exporter/utils"
)

type Dices struct {
	State
}

func NewCaseDices() (*Dices, *pb.Packet) {

	state := State{
		StartTimestamp: time.Now(),
		Transactions:   []*pb.Transaction{},
	}

	return &Dices{state}, &pb.Packet{
		Response: &pb.Packet_Ack{
			Ack: &pb.Ack{
				ReqAck: pb.RequestType_START,
			},
		},
	}
}

func (d *Dices) Stop(limit int) (*pb.Packet, error) {

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
		Response: &pb.Packet_Demo2D6{
			Demo2D6: &pb.Demo2D6{
				Number1: utils.RandomNumber(fmt.Sprintf("/%v/1", txHashListJoined), 6),
				Number2: utils.RandomNumber(fmt.Sprintf("/%v/2", txHashListJoined), 6),
				Details: details,
			},
		},
	}, nil
}

func (d *Dices) Cancel() *pb.Packet {
	return &pb.Packet{
		Response: &pb.Packet_Ack{
			Ack: &pb.Ack{
				ReqAck: pb.RequestType_CANCEL,
			},
		},
	}
}

func (d *Dices) AppendTransaction(tx *pb.Transaction) *pb.Packet {

	d.Transactions = append(d.Transactions, tx)

	return &pb.Packet{
		Response: &pb.Packet_Size{
			Size: &pb.TxSize{
				Length: int64(len(d.Transactions)),
			},
		},
	}
}
