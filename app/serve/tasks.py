# api_creator/tasks.py
from celery import shared_task,Celery
import docker
import time

client = docker.from_env()

@shared_task
def execute_api(endpoint, api_data):
    container = None
    result=""
    try:
        from deploy.models import Api
        api = Api.objects.get(endpoint=endpoint)
        container = client.containers.run(
            image="sandbox_image",
            environment={"API_CODE": str(api.code)},
            detach=True,
            network_mode="none"
        )
        # container.start()
        time.sleep(0.1)
        result = container.logs().decode("utf-8")
        print("Result:", result)
    except Exception as e:
        print("Task exception: ", e)        
    finally:
        if container:
            container.stop()
            container.remove()
    
    return result
