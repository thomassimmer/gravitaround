#!/bin/bash

cd gravitaround

sudo chown -R $USER:admin /usr/local
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install Postgres
brew install gdal

virtualenv -p python3 venv
. venv/bin/activate
pip install .
echo updating...

osascript -e 'tell application "Terminal" to activate' -e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down' -e 'tell application "Terminal" to do script "postgres -D /usr/local/var/postgres" in selected tab of the front window'

./manage.py makemigrations app
./manage.py migrate


osascript -e 'tell application "Terminal" to activate' -e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down' -e 'tell application "Terminal" to do script "sleep 5" in selected tab of the front window' -e 'tell application "Terminal" to do script" open http://127.0.0.1:8000/" in selected tab of the front window'

./manage.py runserver


