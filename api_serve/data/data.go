package data

import "net/url"

type Request struct {
	Body   string                 `json:"body"`
	Header map[string]interface{} `json:"header"`
}

type Payload struct {
	QueryParams url.Values `json:"query_params"`
	PathParams  string     `json:"path_params"`
	Method      string     `json:"method"`
	Request     Request    `json:"request"`
}
