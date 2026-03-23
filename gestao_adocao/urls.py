from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('forms/', views.forms, name="forms"),
    path('admin/', views.lista_cadastros, name="admin"),
    path('admin/user/<int:id>/', views.user, name="user"),
    path('events/', views.events, name="events"),
]