from django.conf.urls import url

from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt

from . import views
from gravitaround_app import processes

app_name = 'app'

urlpatterns = [
    path('', csrf_exempt(views.home), name='home'),
    path('favourite/', csrf_exempt(views.favourite), name='favourite'),
    path('connexion/', csrf_exempt(views.connexion), name='connexion'),
    path('authentication/', csrf_exempt(views.authentication), name='authentication'),
    path('new_user/', csrf_exempt(views.new_user), name='new_user'),
    path('deconnect/', csrf_exempt(views.deconnect), name='deconnect'),
    path('contact/', csrf_exempt(views.contact), name='contact'),
    path('rechercheSat/', csrf_exempt(views.recherche_sat), name='rechercheSat'),
    path('recherchePays/', csrf_exempt(views.recherche_pays), name='recherchePays'),
    path('display/', csrf_exempt(views.display), name='display'),
    path('update/', csrf_exempt(views.update), name='update'),
    path('favourite_group/', csrf_exempt(views.favourite_group), name='favourite_group'),
    path('group_creation/', csrf_exempt(views.group_creation), name='group_creation'),
    path('delete_favourite_group/', csrf_exempt(views.delete_favourite_group), name='delete_favourite_group'),

]
