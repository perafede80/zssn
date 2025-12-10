from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from .constants import (
    AMMUNITION_POINTS,
    FOOD_POINTS,
    GENDER_CHOICES,
    MEDICATION_POINTS,
    WATER_POINTS,
)


class Survivor(models.Model):
    """
    Represents a survivor in the Zombie Survival Social Network (ZSSN).
    Survivors have attributes such as name, age, gender, location, infection status,
    and reports count. They also have an associated inventory of resources.
    """

    name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        help_text="The gender of the survivor (Male, Female, or Other)."
    )
    latitude = models.FloatField(
        validators=[MinValueValidator(-90), MaxValueValidator(90)],
        help_text="The latitude of the survivor's last known location (-90 to 90)."
    )
    longitude = models.FloatField(
        validators=[MinValueValidator(-180), MaxValueValidator(180)],
        help_text="The longitude of the survivor's last known location (-180 to 180)."
    )
    is_infected = models.BooleanField(
        default=False,
        help_text="Indicates whether the survivor is infected (True) or not (False). "
                  "Infected survivors cannot trade or update their inventory."
    )
    reports_count = models.PositiveIntegerField(
        default=0,
        help_text="The number of times the survivor has been reported as infected. "
                  "A survivor is marked as infected after 3 reports."
    )

    def clean(self):
        """
        Validate the gender field at the model level.
        """
        valid_genders = [choice[0] for choice in GENDER_CHOICES]
        if self.gender not in valid_genders:
            raise ValidationError({'gender': f"Invalid gender. Must be one of {valid_genders}."})

    def __str__(self):
        """Returns the string representation of the survivor."""
        return self.name

    def get_location(self):
        """
        Returns the survivor's location as a tuple of latitude and longitude.
        Example: (40.7128, -74.0060)
        """
        return (self.latitude, self.longitude)

    def set_location(self, latitude, longitude):
        """
        Sets the survivor's location to the specified latitude and longitude.
        :param latitude: The new latitude value (-90 to 90).
        :param longitude: The new longitude value (-180 to 180).
        """
        self.latitude = latitude
        self.longitude = longitude

    def get_inventory(self):
        """
        Returns the survivor's inventory as a dictionary with item names as keys and quantities as values.
        Example: {"WATER": 2, "FOOD": 3}
        """
        return {inv.item: inv.quantity for inv in self.inventory.all()}

    class Meta:
        db_table = "survivors"
        verbose_name = "Survivors"


class Item(models.TextChoices):
    """
    Represents the predefined types of items available in the ZSSN system.
    Each item has a name and a point value used for trading.
    """

    WATER = 'WATER', f'Water - {WATER_POINTS} points'
    FOOD = 'FOOD', f'Food - {FOOD_POINTS} points'
    MEDICATION = 'MEDICATION', f'Medication - {MEDICATION_POINTS} points'
    AMMUNITION = 'AMMUNITION', f'Ammunition - {AMMUNITION_POINTS} point'

    @classmethod
    def get_points(cls, item_name):
        """
        Returns the point value of a given item.
        :param item_name: The name of the item (e.g., 'WATER', 'FOOD').
        :return: The point value of the item, or 0 if the item is invalid.
        """
        points_map = {
            cls.WATER: WATER_POINTS,
            cls.FOOD: FOOD_POINTS,
            cls.MEDICATION: MEDICATION_POINTS,
            cls.AMMUNITION: AMMUNITION_POINTS,
        }
        return points_map.get(item_name, 0)


class Inventory(models.Model):
    """
    Represents an inventory item owned by a survivor.
    Each inventory item is associated with a survivor and has a type and quantity.
    """

    survivor = models.ForeignKey(
        Survivor,
        related_name='inventory',
        on_delete=models.CASCADE,
        help_text="The survivor who owns this inventory item."
    )
    item = models.CharField(
        max_length=10,
        choices=Item.choices,
        help_text="The type of item (e.g., WATER, FOOD). Each item has a predefined point value."
    )
    quantity = models.PositiveIntegerField(
        help_text="The quantity of the item in the survivor's inventory."
    )

    class Meta:
        db_table = "inventory"
        verbose_name = "Inventory"

    def __str__(self):
        """Returns the string representation of the inventory item."""
        return f"Inventory ID: {self.id} - {self.item} ({self.quantity})"

    @classmethod
    def calculate_total_worth(cls, items):
        """
        Calculates the total worth of a set of items based on their point values.
        :param items: A dictionary with item names as keys and quantities as values.
        :return: The total worth of the items.
        """
        total_worth = 0
        for item_name, quantity in items.items():
            total_worth += Item.get_points(item_name) * quantity
        return total_worth