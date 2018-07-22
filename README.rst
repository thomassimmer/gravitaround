# Gravit'around

A web app to allow you to watch your favourite satellites in real time around Earth.

Prerequisites
------------

You'll need :

    - Python 3.6
    - pip package management tool
    - Postgres

Installation
------------

A Python 3 virtualenv is required to install the project from the ``gravitaround``
directory::

    $ virtualenv -p python3 venv
    $ . venv/bin/activate
    $ cd ~/gravitaround
    $ pip install .

Once you have created and activated the necessary virtual environment, you can prepare the necessary database and run the server thanks to ``manage.py``::

    $ postgres -D /usr/local/var/postgres

You possibly need to create a database and a user :

    $ psql postgres
    $ postgres=# CREATE DATABASE gravitaround;
    $ postgres=# CREATE USER gravitaround WITH SUPERUSER;

    $ ./manage.py makemigrations app
    $ ./manage.py migrate
    $ ./manage.py runserver

Then, you can go at http://127.0.0.1:8000/ to see what gravit around your planet !

