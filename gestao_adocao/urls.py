from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('forms/', views.forms, name="forms"),
    path('admin/', views.lista_cadastros, name="admin"),
    path('admin/user/<int:id>/', views.user, name="user"),
<<<<<<< HEAD
    path('login/', views.login_view, name="login"),
    path('logout/', views.logout_view, name="logout"),
=======
>>>>>>> 4f0752425844aaa688ff54e09df4d8323aa38cf4
]