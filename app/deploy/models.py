from django.db import models, transaction, IntegrityError
from django.conf import settings
import random, string
from hashlib import md5
from . import exceptions
from uuid import uuid4

def generate_unique_endpoint():
    length = 8
    characters = string.ascii_letters + string.digits
    while True:
        random_endpoint = ''.join(random.choices(characters, k=length))
        if not Api.objects.filter(endpoint=random_endpoint).exists():
            return random_endpoint

def generate_api_hash(code, method, api_data):
    target = "CODE:"+str(code)+"\nMETHOD:"+method+"\nAPIDATA:"+api_data
    return md5(target.encode("utf-8")).hexdigest()


class Api(models.Model):
    # name = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='apis')
    api_name = models.CharField(max_length=255)
    endpoint = models.CharField(max_length=255, default=generate_unique_endpoint, unique=True)
    method = models.CharField(max_length=255)
    code = models.TextField()
    api_data = models.TextField() # path_params:["p1","p2"], content_type:"application/json" 
    api_hash = models.TextField(max_length=128, blank=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.endpoint:
            self.endpoint = generate_unique_endpoint()
        self.api_hash = generate_api_hash(self.code, self.method, self.api_data)
        try:
            with transaction.atomic():
                super(Api, self).save(*args, **kwargs)
        except IntegrityError as e:
            if 'unique constraint' in str(e).lower():
                raise exceptions.ApiHashConflict("API Hash Collision.") from e
            else:
                raise exceptions.GenericDBException("Something went wrong")

class Table(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tables')
    table_name = models.CharField(max_length=255)
    table_uuid = models.UUIDField(default=uuid4, editable=False, unique=True)
    table_columns = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not Table.objects.filter(table_name=self.table_name).filter(user=self.user):
            try:
                with transaction.atomic():
                    super(Table, self).save(*args, **kwargs)
            except IntegrityError as e:
                if 'unique constraint' in str(e).lower():
                    raise e
                else:
                    raise exceptions.GenericDBException("Something went wrong")
        else:
            raise exceptions.TableDuplicateName("Duplicate table exists!")

    def __str__(self):
        return self.table_name