from django.urls import path, include
from .views import ApiServe

urlpatterns = [
    path('<str:endpoint>', ApiServe.as_view(), name='serve'),
]