from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('forms/', views.forms, name="forms"),
    path('admin/', views.lista_cadastros, name="admin"),
    path('admin/user/<int:id>/', views.user, name="user"),
    path('login/', views.login_view, name="login"),
    path('logout/', views.logout_view, name="logout"),
    path('novo/', views.novo_front, name="novo"),
    path('registrar-doacao/', views.registrar_doacao, name='registrar_doacao'),
]