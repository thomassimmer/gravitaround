# pylint:disable=unused-variable

from __future__ import print_function

from django.contrib import admin

from gravitaround_app import models as app_models

admin.site.register(app_models.Satellite)
admin.site.register(app_models.Contain)
admin.site.register(app_models.Possesion)
admin.site.register(app_models.FavouriteGroup)
admin.site.register(app_models.User)
