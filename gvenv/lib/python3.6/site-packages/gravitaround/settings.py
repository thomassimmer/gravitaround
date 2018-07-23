# Copyright (c) Polyconseil SAS. All rights reserved.

# pylint:disable=undefined-variable
# pylint:disable=unused-import
# pylint:disable=unused-variable
# pylint:disable=no-else-return

import os

from gravitaround.version import VERSION


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = '4e&6aw+(5&cg^_!05r(&7_#dghg_pdgopq(yk)xa^bog7j)^*j'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition
# ======================

TEST_APPS = ()

LANGUAGE_CODE = 'fr'

MIDDLEWARE_CLASSES = (
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'gravitaround.ops.urls'

DJANGO_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    'django.contrib.gis',
    'django.contrib.postgres',
    'django.db.migrations',
    'raven.contrib.django',

    'gravitaround.core.app',

)

USE_TZ = True

TIME_ZONE = 'Europe/Paris'

INSTALLED_APPS = DJANGO_APPS

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, "gravitaround/ops/app/templates")],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'gravitaround',
        'USER': 'gravitaround',
        'PASSWORD': 'gravitaround',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}


STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
    'gravitaround/staticassets/',
]
