from rest_framework import serializers
from .models import Api, Table

class ApiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Api
        fields = ['id', 'endpoint', 'content_type', 'method', 'code', 'created_at', 'updated_at']

class TableSerializer(serializers.ModelSerializer):
    # table_uuid = serializers.UUIDField(format='canonical', read_only=True)
    class Meta:
        model = Table
        fields = ['id', 'table_name', 'table_columns', 'created_at', 'updated_at','table_uuid']
        