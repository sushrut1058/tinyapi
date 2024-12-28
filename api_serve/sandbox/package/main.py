from core import Table
from script import API
import argparse
import json
from core import DB
import utils

table = Table('dum2')

parser = argparse.ArgumentParser(description="Args")
parser.add_argument("--payload", type=str, required=True)
args = parser.parse_args()

request = utils.unmarshal(args)

api = API(DB())
response = api.handler(request, utils.response)

print(json.dumps(response))