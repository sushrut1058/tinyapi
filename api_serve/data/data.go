package data

type Request struct {
	Body    interface{}            `json:"body"`
	Headers map[string]interface{} `json:"headers"`
}

type Payload struct {
	QueryParams map[string]any    `json:"query_params"`
	PathParams  map[string]string `json:"path_params"`
	Method      string            `json:"method"`
	Request     Request           `json:"request"`
}

type ApiData struct {
	PathParams  []string `json:"path_params"`
	ContentType string   `json:"content_type"`
}
