"""Utilities for test modules"""
import os, unittest, doctest

from django.core.serializers import deserialize
from django.db.models import get_apps
from django.test.simple import get_tests
from django.core import management

try:
    set
except:
    from sets import Set as set

def load_fixture(path, file_type='json'):
    """Load a fixture file"""
    management.call_command('loaddata', path, verbosity=0)

    #fp = file(path)
    #cont = fp.read()
    #fp.close()
    #
    #for obj in deserialize(file_type, cont):
    #    obj.save()

def model_has_fields(model_class, fields):
    """Checks if a model class has all fields in fields list and returns a
    list of fields that aren't in one of them.
    
    This method returns an empty list ( [] ) when everything is ok"""
    fields = set(fields)
    model_fields = set(
            [f.name for f in model_class._meta.fields]+\
            [f.name for f in model_class._meta.many_to_many]
            )
    return list(fields - model_fields)

def assert_model_has_fields(model_class, fields):
    if model_has_fields(model_class, fields):
        return fields

def is_model_class_fk(model_class_from, field, model_class_to):
    """Returns True if field is ForeignKey to model class informed"""
    return issubclass(
            model_class_from._meta.get_field_by_name(field)[0].rel.to,
            model_class_to,
            )

def is_field_type(model_class_from, field, field_type, **kwargs):
    """Checks if a field of a model class if of the type informed.
    If field_type value is a class, it compares just the class of field,
    if field_type is an instance of a field type class, it compares the
    max_length, max_digits and decimal_places, blank and null"""
    field = model_class_from._meta.get_field_by_name(field)[0]

    if field.__class__ != field_type:
        return False

    for k,v in kwargs.items():
        if k == 'to':
            if v != field.rel.to:
                raise Exception('%s: %s'%(k, unicode(field.rel.to)))
        elif v != getattr(field, k, None):
            raise Exception('%s: %s'%(k, unicode(getattr(field, k, None))))

    return True

def is_model_pk(model_class, field):
    """Checks if a field is the primary key of the model class"""
    return model_class._meta.pk.name == field

def url_status_code(url, status_code=200, content=None, client=None, return_response=False):
    """Checks if the informed URL returns the wanted status_code"""
    if not client:
        from django.test.client import Client
        client = Client()

    resp = client.get(url)

    if return_response:
        return resp

    ret = True

    if status_code and status_code == resp.status_code:
        ret = ret and True

    if content and content == resp.status_code:
        ret = ret and True

    return ret

def assert_equal(arg1, arg2):
    """Returns the arguments if any of them is different to the others, otherelse, returns empty."""
    if arg1 != arg2:
        print arg1
        print '<>'
        print arg2

def assert_equal_numbers(arg1, arg2):
    """Does the same of assert_equal but converts both to float to ensure they are in the same
    value type - as a number."""
    assert_equal(float(arg1), float(arg2))

def assert_between(arg1, arg2, arg3):
    """Makes assertation, printing the values if the first is not greater or equal the second
    one and lower or equal to the third onde."""
    if arg1 < arg2 or arg2 > arg3:
        print '%s is not between %s and %s'%(arg1, arg2, arg3)

def assert_true(arg1):
    if not bool(arg1):
        print '%s is not a True value'%arg1

def assert_false(arg1):
    if bool(arg):
        print '%s is not a False value'%arg1

