import json
from urllib.parse import parse_qs

class EmptyArgument(Exception):
    pass

class InvalidArgs(Exception):
    pass

class Request(dict):
    def __getattr__(self, name):
        return self[name]

    def __setattr__(self, name, value):
        self[name] = value
    
    def __delattr__(self, name):
        return super().__delattr__(name)
    
def unmarshal(args):
    payload = args.payload
    jsonObj = json.loads(payload)

    request = jsonObj['request']
    request['params'] = jsonObj.get("path_params")
    request['query'] = jsonObj.get("query_params")
    request['method'] = jsonObj.get("method")
    r = jsonObj.get("request")
    request['body'] = r.get("body")
    request['headers'] = r.get("headers")
    
    request = Request(request)

    try:
        content_type = request.headers['Content-Type']
        if content_type=='application/json':
            request.body = json.loads(request.body)
        elif content_type == 'application/x-www-form-urlencoded':
            request.body = parse_qs(request.body)
        elif content_type == 'text/plain':
            request.body = request.body.strip()
    except Exception as e:
        pass

    return request

def response(data, status=200):
    return {"Response":data, "Status":status}