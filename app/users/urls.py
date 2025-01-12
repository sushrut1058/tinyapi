from django.urls import path, include
from django.http import JsonResponse
from .views import AuthView

def login_success(request):
    user = request.user
    if user.is_authenticated:
        return JsonResponse({
            'id': user.id,
            'email': user.email,
            'name': user.get_full_name(),
        })
    return JsonResponse({'error': 'Unauthorized'}, status=401)

urlpatterns = [
    
    path('login/', AuthView.as_view(), name ='home'),
    path('login-success/', login_success)
]