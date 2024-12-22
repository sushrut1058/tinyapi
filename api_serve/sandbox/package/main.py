from core import Table
from script import handle
import argparse
import json

table = Table('dum2')

parser = argparse.ArgumentParser(description="Args")
parser.add_argument("--payload", type=str, required=True)

args = parser.parse_args()

payload = args.payload
jsonObj = json.loads(payload)

request = jsonObj['request']
request['params'] = jsonObj.get("path_params")
request['query'] = jsonObj.get("query_params")
request['method'] = jsonObj.get("method")
r = jsonObj.get("request")
request['body'] = r.get("body")
request['header'] = r.get("header")
# print("Payload Received in python script:\n", request)

response = handle(request)

print(json.dumps(response))