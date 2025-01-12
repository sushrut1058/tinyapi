from rest_framework import serializers
from .models import Api, Table
import json

class ApiSerializer(serializers.ModelSerializer):
    def to_internal_value(self, data):
        if 'api_data' in data:
            data['api_data'] = json.dumps(data['api_data'])
        data['user']=1
        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['api_data'] = json.loads(ret['api_data'])
        ret['user'] = 1
        return ret
   
    class Meta:
        model = Api
        fields = ['id', 'user', 'api_name', 'endpoint', 'api_data', 'method', 'code', 'created_at', 'updated_at']

class TableSerializer(serializers.ModelSerializer):
    # table_uuid = serializers.UUIDField(format='canonical', read_only=True)
    def to_internal_value(self, data):
        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        return ret

    class Meta:
        model = Table
        fields = ['id', 'user', 'table_name', 'table_columns', 'created_at', 'updated_at','table_uuid']
        