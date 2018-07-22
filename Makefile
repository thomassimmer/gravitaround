PACKAGE = gravitaround

SERVICES = core ops

RUNSERVER_BASE_PORT = 8100

include $(shell makefile-path django.mk)

SERVICES_WITH_STATICS := ops
