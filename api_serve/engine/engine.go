package engine

import (
	"archive/tar"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"snaplet/api_serve/data"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
)

var Client *client.Client
var ContainerID string

func Start() {
	createEngine()
	runEngine(ContainerID)
}

func Stop() {
	Client.Close()
}

func Run(script string, payload *data.Payload) string {
	copyScriptToContainer(script, ContainerID, payload)
	return execute(ContainerID, payload)
}

func createEngine() {
	var err error
	Client, err = client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		panic(err)
	}
	containerConfig := container.Config{
		Image: "sandbox",
		Cmd:   []string{"sleep", "infinity"},
	}
	resp, err := Client.ContainerCreate(context.Background(), &containerConfig, nil, nil, nil, "worker")
	if err != nil {
		panic(err)
	}
	ContainerID = resp.ID
	log.Print("Container Created.")
}

func execute(containerID string, payload *data.Payload) string {
	jsonObj, err := json.Marshal(payload)
	if err != nil {
		panic(err)
	}
	fmt.Println("Payload String:\n", string(jsonObj))
	execConfig := &types.ExecConfig{
		Cmd:          []string{"python3", "package/main.py", "--payload", string(jsonObj)},
		AttachStderr: true,
		AttachStdout: true,
		Tty:          true,
	}
	execIDResp, err := Client.ContainerExecCreate(context.Background(), containerID, *execConfig)
	if err != nil {
		panic(err)
	}
	fmt.Println(execIDResp, execIDResp.ID)
	attachResp, err := Client.ContainerExecAttach(context.Background(), execIDResp.ID, types.ExecStartCheck{Detach: false,
		Tty: true,
	})
	if err != nil {
		panic(err)
	}
	defer attachResp.Close()
	var buffer bytes.Buffer
	io.Copy(&buffer, attachResp.Reader)
	return buffer.String()
}

func copyScriptToContainer(script_string string, containerID string, payload *data.Payload) {
	script := []byte(script_string)
	var buf bytes.Buffer
	tw := tar.NewWriter(&buf)
	header := &tar.Header{
		Name: "script.py",
		Size: int64(len(script)),
		Mode: 0644,
	}
	tw.WriteHeader(header)
	tw.Write(script)
	err := Client.CopyToContainer(context.Background(), containerID, "/app/package/", &buf, types.CopyToContainerOptions{})
	if err != nil {
		panic(err)
	}
}

func runEngine(containerID string) {
	if err := Client.ContainerStart(context.Background(), containerID, container.StartOptions{}); err != nil {
		panic(err)
	}
	log.Print("Container Started.")
}
