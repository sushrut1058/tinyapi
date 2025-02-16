from django.urls import path, include
from django.http import JsonResponse
from .views import AuthView, AuthStatus

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
    
    path('login/', AuthView.as_view(), name='home'),
    path('status/', AuthStatus.as_view(), name='status')
]