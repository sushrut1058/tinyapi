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
print(request)
request['params'] = jsonObj["path_params"]
request['query'] = jsonObj["query_params"]
request['method'] = jsonObj["method"]

print("Payload Received in python script:\n", request)

handle(request)