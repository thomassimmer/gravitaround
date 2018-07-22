from django.conf.urls import url

from . import views
from gravitaround.core.app import processes

app_name = 'app'

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^favourite/$', views.favourite, name='favourite'),
    url(r'^connexion/$', views.connexion, name='connexion'),
    url(r'^authentication/$', views.authentication, name='authentication'),
    url(r'^new_user/$', views.new_user, name='new_user'),
    url(r'^deconnect/$', views.deconnect, name='deconnect'),
    url(r'^contact/$', views.contact, name='contact'),
    url(r'^rechercheSat/$', views.recherche_sat, name='rechercheSat'),
    url(r'^recherchePays/$', views.recherche_pays, name='recherchePays'),
    url(r'^display/$', views.display, name='display'),
    url(r'^update/$', views.update, name='update'),
    url(r'^favourite_group/$', views.favourite_group, name='favourite_group'),
    url(r'^group_creation/$', views.group_creation, name='group_creation'),
    url(r'^delete_favourite_group/$', views.delete_favourite_group, name='delete_favourite_group'),

]
