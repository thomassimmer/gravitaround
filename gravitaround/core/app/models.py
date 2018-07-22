# Create your models here.

from django.db import models
from django.utils.translation import ugettext_lazy as _

from dirtyfields import DirtyFieldsMixin


class User(DirtyFieldsMixin, models.Model):

    user_id = models.IntegerField(verbose_name=_("user id"), null=True, blank=True, unique=True)
    last_name = models.CharField(max_length=255, verbose_name=_("last name"), null=True)
    first_name = models.CharField(max_length=255, verbose_name=_("first name"), null=True)
    login = models.CharField(max_length=255, verbose_name=_("login"), null=True, unique=True)
    password = models.CharField(max_length=255, verbose_name=_("password"), null=True)
    is_admin = models.BooleanField(verbose_name=_("admin"), default=False)

    def __str__(self):
        return "{first} {last}".format(
            first=self.first_name,
            last=self.last_name
        )

    class Meta:
        ordering = ('user_id', )
        verbose_name = _("User")
        verbose_name_plural = _("Users")


class Satellite(DirtyFieldsMixin, models.Model):

    satellite_id = models.IntegerField(verbose_name=_("Satellite's id"), null=True, unique=True)
    satellite_name = models.CharField(max_length=1000, verbose_name=_("Satellite's name"), null=True)
    category = models.CharField(max_length=1000, verbose_name=_("Category"), null=True)
    orbit = models.CharField(max_length=1000, verbose_name=_("Orbit"), null=True)
    longitude = models.IntegerField(verbose_name=_("Longitude"), null=True)
    latitude = models.IntegerField(verbose_name=_("Latitude"), null=True)
    altitude = models.FloatField(verbose_name=_("Altitude"), null=True)
    inclination = models.FloatField(verbose_name=_("Inclination"), null=True)
    node_longitude = models.FloatField(verbose_name=_("Node Longitude"), null=True)
    mean_anomaly = models.FloatField(verbose_name=_("Mean Anomaly"), null=True)
    semi_major_axis = models.FloatField(verbose_name=_("Semi major axis"), null=True)
    semi_minor_axis = models.FloatField(verbose_name=_("Semi minor axis"), null=True)
    arg = models.FloatField(verbose_name=_("Arg"), null=True)
    country = models.CharField(max_length=1000, verbose_name=_("Country"), null=True)
    source = models.TextField(max_length=1000, verbose_name=_("Source"), null=True)

    def __str__(self):
        return self.satellite_name

    class Meta:
        ordering = ('satellite_name',)
        verbose_name = _("Satellite")
        verbose_name_plural = _("Satellites")


class FavouriteGroup(DirtyFieldsMixin, models.Model):

    group_id = models.IntegerField(verbose_name=_("Group's id"), null=True)
    name = models.CharField(max_length=1000, verbose_name=_("Name"), null=True)
    color = models.CharField(max_length=1000, verbose_name=_("Color"), null=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('name',)
        verbose_name = _("Favourite Group")
        verbose_name_plural = _("Favourite Groups")


class Contain(DirtyFieldsMixin, models.Model):

    satellite_id = models.ForeignKey(Satellite, on_delete=models.CASCADE)
    group_id = models.ForeignKey(FavouriteGroup, on_delete=models.CASCADE)

    def __str__(self):
        return "{idsat} : {idgroup}".format(
            idsat=self.satellite_id,
            idgroup=self.group_id
        )

    class Meta:
        ordering = ('satellite_id',)
        verbose_name = _("Contain")
        verbose_name_plural = _("Contains")


class Possesion(DirtyFieldsMixin, models.Model):

    group_id = models.ForeignKey(FavouriteGroup, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return "{idgroup} : {iduser}".format(
            iduser=self.user_id,
            idgroup=self.group_id
        )

    class Meta:
        ordering = ('group_id',)
        verbose_name = _("Possession")
        verbose_name_plural = _("Possessions")
