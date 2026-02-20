from django.urls import path
from . import views

urlpatterns = [
    path('formulario/', views.forms, name="forms"),
    path('cadastros/', views.lista_cadastros, name="lista_cadastros")
] 
