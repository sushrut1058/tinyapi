package data

type Request struct {
	Body   string                 `json:"body"`
	Header map[string]interface{} `json:"header"`
}

type Payload struct {
	QueryParams map[string]any `json:"query_params"`
	PathParams  string         `json:"path_params"`
	Method      string         `json:"method"`
	Request     Request        `json:"request"`
}
