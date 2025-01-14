from django.urls import path, include
from .views import ApiTest, ApiDeploy, ApiDelete, TablesCreate, TablesDelete, TablesFetch, TablesEdit

urlpatterns = [
    path('test', ApiTest.as_view(), name='test'),
    path('deploy', ApiDeploy.as_view(), name='deploy'),
    path('list', ApiDeploy.as_view(), name='list_apis'),
    path('delete', ApiDelete.as_view(), name='delete'),
    
    path('tables/create', TablesCreate.as_view(), name='create'),
    path('tables/delete', TablesDelete.as_view(), name='delete'),
    path('tables/list/<str:category>/', TablesFetch.as_view(), name='list'),
    path('tables/view/<str:table_name>', TablesFetch.as_view(), name='view'),
    path('tables/data/<str:action>', TablesEdit.as_view(), name='edit-row'),
]