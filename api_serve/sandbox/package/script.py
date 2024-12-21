#template
print(1)
def handle(request: any = None) -> dict:
    #with open('package/core.py') as f:
    #    print(f.read())
    #    f.close()
    response = {
        "StatusCode":200,
        "Body":"HIT!"
    }
    return response
