"""
Shows basic usage of the Google Calendar API. Creates a Google Calendar API
service object and outputs a list of the next 10 events on the user's calendar.
"""

from __future__ import print_function

from django.core.management.base import BaseCommand

from gravitaround.core.app import processes


class Command(BaseCommand):
    help = 'Add events to Django\'database'

    def handle(self, *args, **options):

        processes.main()
