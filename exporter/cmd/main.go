package main

import (
	"fmt"
	"net/http"

	"github.com/filouz/rnbb/exporter/factory"
	"github.com/filouz/rnbb/exporter/utils"
	"github.com/spf13/viper"
	"go.uber.org/zap"
)

func main() {

	handler := factory.NewHandler()

	mux := http.NewServeMux()
	mux.Handle("/", handler)

	go handler.StartTxListener(viper.GetString(utils.ENVNAME_ZMQ_EP))

	utils.Logger.Info("Server starting", zap.String("port", viper.GetString(utils.ENVNAME_PORT)))

	http.ListenAndServe(fmt.Sprintf(":%s", viper.GetString(utils.ENVNAME_PORT)), mux)
}
