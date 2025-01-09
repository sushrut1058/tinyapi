package engine

import (
	"archive/tar"
	"backpocket/api-serve/data"
	"bytes"
	"context"
	"log"

	"github.com/docker/docker/api/types"
)

// //////////////////////////////////////////////
type EngineHandle struct {
	RequestId   uint16
	ContainerID string
	Channel     chan bool
}

// //////////////////////////////////////////////
var Handle *EngineHandle

func SetHandle(handle *EngineHandle) {
	Handle = handle
}
func GetHandle() *EngineHandle {
	<-Handle.Channel
	return Handle
}

// /////////////////////////////////////////////
type Engine interface {
	Start()
	Stop()
	Run()
	CopyScriptToContainer()
}

func (handle *EngineHandle) Start() {
	handle.ContainerID = createEngine()
	runEngine(handle.ContainerID)
	log.Print("Container Created")
}

func (handle *EngineHandle) Stop() {
	Client.Close()
}

func (handle *EngineHandle) Run(script string, payload *data.Payload) (string, string) {
	file := data.File{
		Name: "script.py",
		Data: []byte(script),
		Dest: "/app/package/",
	}
	handle.CopyScriptToContainer(&file, handle.ContainerID)
	return execute(handle.ContainerID, payload)
}

func (handle *EngineHandle) CopyScriptToContainer(file *data.File, containerID string) {
	script := file.Data
	var buf bytes.Buffer
	tw := tar.NewWriter(&buf)
	header := &tar.Header{
		Name: file.Name,
		Size: int64(len(script)),
		Mode: 0644,
	}
	tw.WriteHeader(header)
	tw.Write(script)
	err := Client.CopyToContainer(context.Background(), containerID, file.Dest, &buf, types.CopyToContainerOptions{})
	if err != nil {
		panic(err)
	}
}
