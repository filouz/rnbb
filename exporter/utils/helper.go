package utils

import (
	"crypto/sha256"
	"encoding/binary"
	"encoding/hex"
	"io"
	"math/rand"
)

func init() {
	InitLogger()
	InitConfig()
}

func CalcSeed(strSeed string) int64 {
	h := sha256.New()
	io.WriteString(h, strSeed)
	var seed uint64 = binary.BigEndian.Uint64(h.Sum(nil))

	return int64(seed)
}

func RandomNumber(strSeed string, max int) int64 {
	seed := CalcSeed(strSeed)
	rand.Seed(seed)
	return int64(rand.Intn(max) + 1)
}

func Hash256(str string) string {
	h := sha256.New()
	io.WriteString(h, str)
	return hex.EncodeToString(h.Sum(nil))
}
