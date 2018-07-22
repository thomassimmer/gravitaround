# Copyright (c) Polyconseil SAS. All rights reserved.

# pylint:disable=undefined-variable
# pylint:disable=unused-import
# pylint:disable=unused-variable
# pylint:disable=no-else-return

import os

from googleapiclient.discovery import build
from httplib2 import Http
from oauth2client import client
from oauth2client import file
from oauth2client import tools

from bluetils.settings import importer as settings_importer
from bluetils.settings.config import load_config

from gravitaround.version import VERSION


# Configuration of Bluetils common settings
# =========================================
ROOT_DIR = os.path.abspath(os.path.dirname(__file__))
CHECKOUT_DIR = os.path.abspath(os.path.dirname(ROOT_DIR))

STATIC_URL = '/static/'
STATICFILES_DIRS = ()

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

PROJECT_NAME = 'gravitaround'
SYSTEM_HRID = PROJECT_NAME
SYSTEM_NAME = PROJECT_NAME

CONFIG = load_config(PROJECT_NAME, CHECKOUT_DIR)

SERVICE = CONFIG.getstr('service', 'core')

settings_importer.include('bluetils.settings.common', globals(), locals())

# Application definition
# ======================

TEST_APPS = ()

LANGUAGE_CODE = 'fr'

MIDDLEWARE_CLASSES = COMMON_MIDDLEWARE_CLASSES + (
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
    'bluetils.blauth.apps.DefaultConfig',
    'bluetils.common_ui.apps.DefaultConfig',
    'bluetils.cron.apps.DefaultConfig',
    'bluetils.django_plus.apps.DefaultConfig',
    'bluetils.selftest.apps.SelftestConfig',
    'bluetils.script_helpers',
    'bluetils.services',
    'bluetils.blauth_ldap',

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

INSTALLED_APPS = DJANGO_APPS + DEV_APPS


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(ROOT_DIR, "ops/app/templates")],
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
