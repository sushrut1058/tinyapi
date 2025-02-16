FROM golang:1.23.4-bookworm

WORKDIR api_serve

COPY go.mod go.sum ./
RUN go mod download
COPY . .

EXPOSE 8080
CMD ["go", "run", "."]