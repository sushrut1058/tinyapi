from django.urls import path, include
from .views import ApiTest, ApiDeploy, ApiDelete, Tables

urlpatterns = [
    path('test', ApiTest.as_view(), name='test'),
    path('deploy', ApiDeploy.as_view(), name='deploy'),
    path('delete', ApiDelete.as_view(), name='delete'),
    path('tables/create', Tables.as_view(), name='create'),
    path('tables/list', Tables.as_view(), name='list'),
    path('tables/view/<str:table_name>', Tables.as_view(), name='view')
]