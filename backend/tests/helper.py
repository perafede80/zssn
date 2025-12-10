import random

from zssn_app.models import Inventory, Item, Survivor

DEFAULT_WATER_QUANTITY= 2
DEFAULT_FOOD_QUANTITY= 3
DEFAULT_MEDICATION_QUANTITY= 1
DEFAULT_AMMUNITION_QUANTITY= 5

def create_survivor(latitude=None, longitude=None, is_infected=False):
    """Helper method to create a survivor."""
    names = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Brown"]
    genders = ["M", "F", "O"]

    name = random.choice(names)
    age = random.randint(18, 60)
    gender = random.choice(genders)
    latitude = latitude if latitude is not None else random.uniform(-90, 90)
    longitude = longitude if longitude is not None else random.uniform(-180, 180)

    return Survivor.objects.create(
        name=name,
        age=age,
        gender=gender,
        latitude=round(latitude, 4),
        longitude=round(longitude, 4),
        is_infected=is_infected
    )

def create_inventory(survivor, inventory_items):
    """Helper method to create an inventory for the given survivor."""
    for item_data in inventory_items:
        Inventory.objects.create(survivor=survivor, item=item_data["item"], quantity=item_data["quantity"])

def create_survivor_with_inventory(latitude=None, longitude=None, is_infected=False):
    """Helper method to create a survivor with a random inventory."""
    survivor = create_survivor(latitude=latitude, longitude=longitude, is_infected=is_infected)

    inventory_items = [
        {"item": Item.WATER, "quantity": random.randint(0, 10)},
        {"item": Item.FOOD, "quantity": random.randint(0, 10)},
        {"item": Item.MEDICATION, "quantity": random.randint(0, 10)},
        {"item": Item.AMMUNITION, "quantity": random.randint(0, 10)},
    ]

    create_inventory(survivor, inventory_items)
    return survivor

def create_survivor_with_specific_inventory(
        latitude=None,
        longitude=None,
        is_infected=False,
        water_qty=None,
        food_qty=None,
        medication_qty=None,
        ammunition_qty=None):
    """Helper method to create a survivor with a specific quantity per type of items in inventory."""
    survivor = create_survivor(latitude=latitude, longitude=longitude, is_infected=is_infected)

    # Use random quantities if not specified
    inventory_items = [
        {"item": Item.WATER, "quantity": water_qty},
        {"item": Item.FOOD, "quantity": food_qty},
        {"item": Item.MEDICATION, "quantity": medication_qty},
        {"item": Item.AMMUNITION, "quantity": ammunition_qty},
    ]

    create_inventory(survivor, inventory_items)
    return survivor
