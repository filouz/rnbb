package protostream

import (
	"context"
	"fmt"

	"google.golang.org/protobuf/proto"
	// "github.com/golang/protobuf/proto"

	"nhooyr.io/websocket"
)

type ProtoStream struct {
	rw  *websocket.Conn
	ctx context.Context
}

func NewProtoStream(ctx context.Context, rw *websocket.Conn) *ProtoStream {

	return &ProtoStream{
		rw:  rw,
		ctx: ctx,
	}
}

func (p *ProtoStream) Send(m proto.Message) error {
	b, err := proto.Marshal(m)
	if err != nil {
		return fmt.Errorf("send.error.marshal %w", err)
	}

	if err = p.rw.Write(p.ctx, websocket.MessageBinary, b); err != nil {
		return fmt.Errorf("send.error %w", err)
	}
	return nil
}

func (p *ProtoStream) Recv(m proto.Message) error {

	_, data, err := p.rw.Read(p.ctx)
	if err != nil {
		return fmt.Errorf("recv.error %w", err)
	}

	err = proto.Unmarshal(data, m)
	if err != nil {
		return fmt.Errorf("recv.error.unmarshal %w", err)
	}

	return nil
}
