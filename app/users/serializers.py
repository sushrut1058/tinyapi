from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'full_name']
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(email = validated_data['email'],full_name=validated_data['fullname'])
        return user