package test

import (
	"context"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
	"time"

	"go.uber.org/zap"
	"nhooyr.io/websocket"

	"github.com/filouz/rnbb/exporter/factory"
	"github.com/filouz/rnbb/exporter/utils"
	"github.com/spf13/viper"

	"github.com/filouz/rnbb/exporter/pb"
	"github.com/filouz/rnbb/exporter/protostream"
)

func httpToWS(t *testing.T, u string) string {
	t.Helper()

	wsURL, err := url.Parse(u)
	if err != nil {
		t.Fatal(err)
	}

	switch wsURL.Scheme {
	case "http":
		wsURL.Scheme = "ws"
	case "https":
		wsURL.Scheme = "wss"
	}

	return wsURL.String()
}

func newWSServer(t *testing.T, h http.Handler) (*httptest.Server, *websocket.Conn) {
	t.Helper()

	s := httptest.NewServer(h)
	wsURL := httpToWS(t, s.URL)

	ws, _, err := websocket.Dial(context.Background(), wsURL, &websocket.DialOptions{})

	if err != nil {
		t.Fatal(err)
	}

	return s, ws
}

func TestRandomNumber(t *testing.T) {

	h := factory.NewHandler()
	go h.StartTxListener(viper.GetString(utils.ENVNAME_ZMQ_EP))

	_, ws := newWSServer(t, h)

	ctx, cancel := context.WithCancel(context.Background())
	stream := protostream.NewProtoStream(ctx, ws)

	go func() {
		defer cancel()

		for {
			packet := &pb.Packet{}
			var err = stream.Recv(packet)
			if err != nil {
				if websocket.CloseStatus(err) != websocket.StatusNormalClosure {
					utils.Logger.Error("[test] Reveiving packet", zap.Error(err))
				}
				return
			}
			switch p := packet.Response.(type) {
			case *pb.Packet_Demo2D6:
				utils.Logger.Info("[test] 2D6 case", zap.Int64("N1", p.Demo2D6.Number1), zap.Int64("N2", p.Demo2D6.Number2), zap.Any("len(txs)", len(p.Demo2D6.Details.Txs)))
			}
		}
	}()

	stream.Send(&pb.Packet{
		Request: &pb.Packet_StartNstop{
			StartNstop: &pb.RnRequest{
				Type:      pb.RequestType_START,
				Case:      pb.RequestCase_D2D6,
				StopLimit: 10,
			},
		},
	})

	time.Sleep(time.Second * 5)

	stream.Send(&pb.Packet{
		Request: &pb.Packet_StartNstop{
			StartNstop: &pb.RnRequest{
				Type: pb.RequestType_STOP,
			},
		},
	})

	<-ctx.Done()
}
