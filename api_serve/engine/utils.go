package engine

import (
	"backpocket/api-serve/data"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/stdcopy"
)

var Client *client.Client
var ContainerID string

func createEngine() string {
	var err error
	user_tables_dbpath := "/db/mount/:/app/db"
	Client, err = client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		panic(err)
	}
	containerConfig := container.Config{
		Image: "sandbox",
		Cmd:   []string{"sleep", "infinity"},
	}
	hostConfig := container.HostConfig{
		Binds: []string{
			user_tables_dbpath,
		},
	}
	resp, err := Client.ContainerCreate(context.Background(), &containerConfig, &hostConfig, nil, nil, "worker")
	if err != nil {
		panic(err)
	}
	ContainerID = resp.ID
	log.Print("Container Created.")
	return resp.ID
}

func execute(containerID string, payload *data.Payload) (string, string) {
	jsonObj, err := json.Marshal(payload)
	if err != nil {
		panic(err)
	}
	fmt.Println("Payload String:\n", string(jsonObj))
	execConfig := &types.ExecConfig{
		Cmd:          []string{"python3", "package/main.py", "--payload", string(jsonObj)},
		AttachStderr: true,
		AttachStdout: true,
		Tty:          false,
	}
	execIDResp, err := Client.ContainerExecCreate(context.Background(), containerID, *execConfig)
	if err != nil {
		panic(err)
	}
	fmt.Println(execIDResp, execIDResp.ID)
	attachResp, err := Client.ContainerExecAttach(context.Background(), execIDResp.ID, types.ExecStartCheck{Detach: false,
		Tty: false,
	})
	if err != nil {
		panic(err)
	}
	defer attachResp.Close()
	var stdoutBuffer, stderrBuffer bytes.Buffer
	outputChan := make(chan error)
	go func() {
		_, err := stdcopy.StdCopy(&stdoutBuffer, &stderrBuffer, attachResp.Reader)
		outputChan <- err
		log.Print(err)
	}()
	if err := <-outputChan; err != nil {
		panic(err)
	}

	return stdoutBuffer.String(), stderrBuffer.String()
	// var buffer bytes.Buffer
	// io.Copy(&buffer, attachResp.Reader)
	// return buffer.String()
}

func runEngine(containerID string) {
	if err := Client.ContainerStart(context.Background(), containerID, container.StartOptions{}); err != nil {
		panic(err)
	}
	log.Print("Container Started.")
}
