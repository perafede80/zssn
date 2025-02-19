from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Survivor(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    latitude = models.FloatField(
        validators=[MinValueValidator(-90), MaxValueValidator(90)]
    )
    longitude = models.FloatField(
        validators=[MinValueValidator(-180), MaxValueValidator(180)]
    )
    is_infected = models.BooleanField(default=False)
    reports_count = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "survivors"
        verbose_name = "Survivors"

    def __str__(self):
        return self.name

    def get_location(self):
        """Returns the survivor's location as a tuple."""
        return (self.latitude, self.longitude)

    def set_location(self, latitude, longitude):
        """Sets the survivor's location."""
        self.latitude = latitude
        self.longitude = longitude

    def get_inventory(self):
        """
        Returns the survivor's inventory as a dictionary with item names as keys and quantities as values.
        Example: {"WATER": 2, "FOOD": 3}
        """
        return {inv.item: inv.quantity for inv in self.inventory.all()}


class Item(models.TextChoices):
    WATER = 'WATER', 'Water - 4 points'
    FOOD = 'FOOD', 'Food - 3 points'
    MEDICATION = 'MEDICATION', 'Medication - 2 points'
    AMMUNITION = 'AMMUNITION', 'Ammunition - 1 point'

    @classmethod
    def get_points(cls, item_name):
        """Returns the point value for a given item."""
        points_map = {
            cls.WATER: 4,
            cls.FOOD: 3,
            cls.MEDICATION: 2,
            cls.AMMUNITION: 1,
        }
        return points_map.get(item_name, 0)

def calculate_total_points(survivor):
    total_points = 0
    for item in survivor.inventory.all():
        total_points += Item.get_points(item.item) * item.quantity
    return total_points

def check_inventory_value(survivor):
    total_points = calculate_total_points(survivor)
    print(f"{survivor.name}'s inventory is worth {total_points} points.")


class Inventory(models.Model):
    survivor = models.ForeignKey(Survivor, related_name='inventory', on_delete=models.CASCADE)
    item = models.CharField(max_length=10, choices=Item.choices)  # Use the predefined choices
    quantity = models.PositiveIntegerField()

    class Meta:
        db_table = "inventory"
        verbose_name = "Inventory"

    def __str__(self):
        return f"{self.survivor.name} - {self.item} ({self.quantity})"

