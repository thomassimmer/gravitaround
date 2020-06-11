import os

from setuptools import find_packages
from setuptools import setup

from gravitaround.version import VERSION


def read(filename):
    with open(filename) as fp:
        return fp.read()


setup(
    name="gravitaround",
    version=VERSION,
    author="Thomas Simmer",
    author_email="thomas.simmer@hotmail.fr",
    description="See your favourite satellite in real time around Earth !",
    license="Proprietary",
    keywords="Gravit Around",
    # url="https://github.com/",
    packages=find_packages(),
    long_description=read('README.md'),
    install_requires=[
         # General
         'Django<2',  # check our other projects to see which version you need to install
         'django-localflavor<2',
         'django-plus',
         'django-dirtyfields',

         # Libraries
         'ephem',
         'lxml',
         'requests',
         'psycopg2',
         'raven',


    ],
    classifiers=[
        "Development Status :: 1 - Planning",
        "Environment :: Web Environment",
        "Framework :: Django",
        "Intended Audience :: Developers",
        "Natural Language :: English",
        "Programming Language :: Python :: 3.6",   # Check out for the correct python version !
    ],
    include_package_data=True,
)
