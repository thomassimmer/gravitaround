# Copyright (c) Polyconseil SAS. All rights reserved.

from django.conf import settings
from django.conf.urls import include
from django.conf.urls import url
from django.contrib import admin
from django.contrib.auth import views as auth_views

from gravitaround.ops.app import views


urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^admin/', admin.site.urls),
    url(r'^gravitaround/', include('gravitaround.ops.app.urls')),
    url(r'^logout/$', auth_views.LoginView.as_view(), name='logout'),
]

if settings.DEBUG_TOOLBAR:
    import debug_toolbar

    urlpatterns += [url(r'ˆ__debug__/', include(debug_toolbar.urls))]
