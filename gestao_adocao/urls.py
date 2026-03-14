from django.urls import path
from . import views

urlpatterns = [
    path('forms/', views.forms, name="forms"),
    path('admin/', views.lista_cadastros, name="admin"),
    path('admin/user/<int:id>/', views.user, name="user"),
]