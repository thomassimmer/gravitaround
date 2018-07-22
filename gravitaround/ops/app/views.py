from django.contrib import messages
from django.shortcuts import redirect
from django.shortcuts import render
from django.http import HttpResponse
from django.db import IntegrityError

from gravitaround.core.app import processes
from gravitaround.core.app import models as app_models


def connexion(request):
    return render(request, 'app/connexion.html')


def authentication(request):

    # We ask the user's informations and open its session.
    login = request.POST['login']
    password = request.POST['motDePasse']

    try:
        qs = app_models.User.objects.get(login=login, password=password)
        request.session['nom'] = qs.last_name
        request.session['prenom'] = qs.first_name
        request.session['id'] = qs.user_id
        messages.success(request, "Welcome " + request.session['prenom'] + " " + request.session['nom'])
        return render(request, 'app/favourite.html')

    except app_models.User.DoesNotExist:

        messages.error(request, "This account doesn't exist.")
        return render(request, 'app/connexion.html')


def new_user(request):
    # We ask the user's informations and open its session.
    login = request.POST['login']
    password = request.POST['motDePasse']
    last_name = request.POST['nom']
    first_name = request.POST['prenom']

    # We insert our user's data in database
    user_id = processes.user_count() + 1
    try:
        qs = app_models.User.objects.update_or_create(
            user_id=user_id,
            first_name=first_name,
            last_name=last_name,
            defaults={
                'login': login,
                'password': password,
                'is_admin': 0
            }
        )

        request.session['nom'] = last_name
        request.session['prenom'] = first_name
        request.session['id'] = user_id
        messages.success(request, "Welcome " + request.session['prenom'] + " " + request.session['nom'])
        return render(request, 'app/favourite.html')

    except IntegrityError:
        messages.error(request, 'This account already exist.')
        return redirect('/gravitaround/connexion/')


def deconnect(request):

    request.session['nom'] = None
    request.session['prenom'] = None
    request.session['id'] = None
    messages.success(request, "Successfully disconnected ")
    return redirect('/gravitaround/connexion/')


def favourite(request):
    if request.session['id']:
        groups = processes.list_favourite_group(request.session['id'])
        return render(request, 'app/favourite.html',
                      {'group_name': [{'name': group[0],
                                       'sats': group[1]} for group in groups], })
    return render(request, 'app/favourite.html')


def delete_favourite_group(request):
    print("ok")
    print(request.POST['name'])
    return HttpResponse(processes.delete_favourite_group(request.POST["name"]))


def contact(request):
    return render(request, 'app/contact.html')


def home(request):
    if request.session['id']:
        groups = processes.list_favourite_group(request.session['id'])
        return render(request, 'app/globe.html',
                      {'group_name': [{'name': group[0],
                                       'sats': group[1]} for group in groups], })
    return render(request, 'app/home.html')


def recherche_sat(request):
    return HttpResponse(processes.sat_list())


def recherche_pays(request):
    return HttpResponse(processes.country_list())


def display(request):
    return HttpResponse(processes.display_sat_data(request.POST['colonne'], request.POST['like']))


def update(request):
    return HttpResponse(processes.main())


def favourite_group(request):
    return HttpResponse(processes.list_favourite_group(request.session['id']))


def group_creation(request):
    name = request.POST['nom']
    sat_list = request.POST['sat_list']
    user_id = request.POST['user_id']
    processes.group_creation(user_id, name, sat_list.split(",")[1:])
    return render(request, 'app/favourite.html')
