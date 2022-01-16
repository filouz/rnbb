package utils

import (
	"fmt"
	"os"

	"github.com/spf13/viper"
	"go.uber.org/zap"
)

const (
	ENVNAME_PORT   = "PORT"
	ENVNAME_ZMQ_EP = "ZMQ_EP"
)

func InitConfig() {

	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")

	if err := viper.ReadInConfig(); err != nil {
		Logger.Debug("Failed to read config file", zap.Error(err))
	}

	viper.AutomaticEnv()

	// Check if the required variables are set
	if !viper.IsSet(ENVNAME_PORT) {
		Logger.Error(fmt.Sprintf("%s is not set\n", ENVNAME_PORT))
		os.Exit(1)
	}

	if !viper.IsSet(ENVNAME_ZMQ_EP) {
		Logger.Panic(fmt.Sprintf("%s is not set\n", ENVNAME_ZMQ_EP))
		os.Exit(1)
	}
}
