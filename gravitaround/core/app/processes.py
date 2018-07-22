#!C:\\python34
# -*- coding: UTF-8 -*-
# enable debugging

import ephem

from lxml import html

import requests

from threading import Thread

from queue import Queue

from django.http import HttpResponse


from gravitaround.core.app import models as app_models

# We first create a list of websites where we take the TLEs, each element of the list is a list
# such as [ " category of satellite", "website link"]
SOURCES = [
    ["Space and Earth Science", ["https://www.celestrak.com/NORAD/elements/science.txt"]],
    ["Geodetic", ["https://www.celestrak.com/NORAD/elements/geodetic.txt"]],
    ["Engineering", ["https://www.celestrak.com/NORAD/elements/engineering.txt"]],
    ["CubeSats", ["https://www.celestrak.com/NORAD/elements/cubesat.txt"]],
    ["Galileo", ["https://www.celestrak.com/NORAD/elements/galileo.txt"]],
    ["Beidou", ["https://www.celestrak.com/NORAD/elements/beidou.txt"]],
    ["GPS Operationnal", ["https://www.celestrak.com/NORAD/elements/gps-ops.txt"]],
    ["Geostationnary", ["https://www.celestrak.com/NORAD/elements/geo.txt"]],
    ["Weather", ["https://www.celestrak.com/NORAD/elements/weather.txt"]],
    ["Space Stations", ["https://www.celestrak.com/NORAD/elements/stations.txt"]],
    ["NOAA", ["https://www.celestrak.com/NORAD/elements/noaa.txt"]],
    ["GOES", ["https://www.celestrak.com/NORAD/elements/goes.txt"]],
    ["Iridium", ["https://www.celestrak.com/NORAD/elements/iridium.txt"]]
    ]


def insert_sat_data(sat_id, name, category, orbit, longitude, latitude, altitude, inclination,
                    node_longitude, mean_anomaly, country, semi_major_axis, semi_minor_axis, arg,
                    source):

    # We insert our satellite's data in database
    app_models.Satellite.objects.update_or_create(
        satellite_id=sat_id,
        defaults={
            'satellite_name': name,
            'category': category,
            'orbit': orbit,
            'longitude': longitude,
            'latitude': latitude,
            'altitude': altitude,
            'inclination': inclination,
            'node_longitude': node_longitude,
            'mean_anomaly': mean_anomaly,
            'semi_major_axis': semi_major_axis,
            'semi_minor_axis': semi_minor_axis,
            'arg': arg,
            'country': country,
            'source': source
        }
    )


def display_sat_data(colonne="", like=""):

    sats = []

    if colonne == "" and like == "":
        return [[
                sat.satellite_id,
                sat.satellite_name,
                sat.category,
                sat.orbit,
                sat.longitude,
                sat.latitude,
                sat.altitude,
                sat.inclination,
                sat.node_longitude,
                sat.mean_anomaly,
                sat.country,
                sat.semi_major_axis,
                sat.semi_minor_axis,
                sat.arg,
                sat.source] for sat in app_models.Satellite.objects.all()]

    for sat in app_models.Satellite.objects.all():
        if like in sat.__dict__[str(colonne)].strip():
            sats.append([
                sat.satellite_id,
                sat.satellite_name,
                sat.category,
                sat.orbit,
                sat.longitude,
                sat.latitude,
                sat.altitude,
                sat.inclination,
                sat.node_longitude,
                sat.mean_anomaly,
                sat.country,
                sat.semi_major_axis,
                sat.semi_minor_axis,
                sat.arg,
                sat.source
            ])
    return HttpResponse(sats)


def sat_list():

    # We ask all satellites' names
    qs = app_models.Satellite.objects.values_list('satellite_name', 'category')
    return qs


def country_list():

    # We ask all countries' names
    qs = app_models.Satellite.objects.values_list('country').order_by('country').distinct()
    return qs


def orbite_type(elevation):
    # We give orbit type to our satellite
    if 160000 <= elevation <= 2000000:
        return "LEO (Low Earth Orbit)"
    elif 2000000 < elevation <= 35700000:
        return "MEO (Medium Earth Orbit)"
    elif 3570000 < elevation <= 35900000:
        return "GEO (Geostationnary Earth Orbit)"
    return "HEO (High Earth Orbit)"


def main():
    data = []
    categories = [item[0] for item in SOURCES]
    num_thread = min(8, len(SOURCES))
    task_queue = Queue()

    def worker():
        # Constantly check the queue for addresses
        while True:
            address = task_queue.get()
            data.append(requests.get(address))

            # Mark the processed task as done
            task_queue.task_done()

    # Create the worker threads
    threads = [Thread(target=worker) for _ in range(num_thread)]
    # Add the websites to the task queue
    [task_queue.put(item[1][0]) for item in SOURCES]
    # Start all the workers
    [thread.start() for thread in threads]
    # Wait for all the tasks in the queue to be processed
    task_queue.join()

    satellites = []

    for index, page in enumerate(data):
        # For every website's HTML code in a list of websites' HTML code

        tree = html.fromstring(page.content)

        # We get HTML tag that we are interested in and we remove undesired caracters
        file = tree.xpath('//text()')[0].strip().split("\r\n")

        # This list contains satellites'name, and their TLE' line 1 and 2
        # It contains for each satellite a list like :[ "nom du satellite" , "ligne 1 du TLE", "ligne2 du TLE" ]

        for i in range(0, len(file)-3, 3):
            sat_name = file[i].strip()
            sat_line1 = file[i+1]
            sat_line2 = file[i+2]
            satellites.append([sat_name, sat_line1, sat_line2, categories[index]])

    # We attribute position and trajectory' informations about each satellite thanks to PyEphem library

    for sat in satellites:

        informations = [i for i in sat[2].split(" ") if i != '']
        sat_id = int(informations[1])
        name = sat[0]
        category = sat[3]
        sat = ephem.readtle(sat[0], sat[1], sat[2])
        sat.compute()
        longitude = str(sat.sublong)
        longitude = longitude.split(":")
        longitude = float(longitude[0]+"."+longitude[1])
        latitude = str(sat.sublat)
        latitude = latitude.split(":")
        latitude = float(latitude[0]+"."+latitude[1])
        pays = 'USA'
        altitude = sat.elevation
        orbit = orbite_type(altitude)
        inclination = float(informations[2])
        node_longitude = float(informations[3])
        n = float(informations[7][:11])                       # Revolutions per day
        mean_anomaly = float(informations[6])              # Mean anomaly
        e = float("0."+informations[4])                       # Eccentricity
        semi_major_axis = int(((3.986004418*10**14)**(1/3))/((2*n*3.1415/86400)**(2/3)))
        semi_minor_axis = int(semi_major_axis*((1-e**2)**0.5))
        arg = float(informations[5])
        source = "www.google.com"

        insert_sat_data(sat_id, name, category, orbit, longitude, latitude, altitude, inclination, node_longitude,
                        mean_anomaly, pays, semi_major_axis, semi_minor_axis, arg, source
                        )


def group_count():

    # We ask the current number of group counts.
    qs = app_models.FavouriteGroup.objects.all().count()
    print(" group number : ", qs)
    return qs


def group_creation(user_id, name, sat):

    # Creation of a favorite group for a user
    group_name = name
    group_id = group_count() + 1
    color = "blue"
    name_sat_list = sat

    app_models.FavouriteGroup.objects.update_or_create(
        group_id=group_id,
        defaults={
            'name': group_name,
            'color': color
        }
    )

    app_models.Possesion.objects.update_or_create(
        group_id=app_models.FavouriteGroup.objects.get(group_id=group_id),
        user_id=app_models.User.objects.get(user_id=user_id)
    )

    for name_sat in name_sat_list:
        print(name_sat)
        qs = app_models.Satellite.objects.get(
            satellite_name=name_sat
        )
        sat_id = qs.satellite_id

        app_models.Contain.objects.update_or_create(
            group_id=app_models.FavouriteGroup.objects.get(group_id=group_id),
            satellite_id=app_models.Satellite.objects.get(satellite_id=sat_id),
        )


def list_favourite_group(user_id):

    result = []
    user = app_models.User.objects.get(user_id=user_id)
    possessions = app_models.Possesion.objects.filter(user_id=user)
    for index, possession in enumerate(possessions):
        favorite_group = app_models.FavouriteGroup.objects.get(group_id=possession.group_id.group_id)
        result.append([favorite_group.name, []])
        contain = app_models.Contain.objects.filter(group_id=favorite_group)
        for sat in contain:
            satellite = app_models.Satellite.objects.get(satellite_id=sat.satellite_id.satellite_id)
            result[index][1].append(satellite.satellite_name)
    return result


def delete_favourite_group(name):

    # Delete a user's favourite group
    app_models.FavouriteGroup.objects.get(name=name).delete()


def user_count():

    # We ask the current number of user counts.
    qs = app_models.User.objects.all().count()
    print(" user number : ", qs)
    return qs


def authentication(request,username,pwd):

    # We ask the user's informations and open its session.
    qs = app_models.User.objects.get(login=username, password=pwd)

    if not qs:
        return 0
    else:
        request.session.nom = qs.last_name
        request.session.prenom = qs.first_name
        request.session.id = qs.user_id
        return 1