import random
from django.core.management.base import BaseCommand
from zssn_app.models import Survivor, Inventory, Item
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Seed the database with at least 10 survivor records'

    def handle(self, *args, **kwargs):
        Survivor.objects.all().delete()

        # Add 10 survivors with randomly generated attributes
        for i in range(1, 11):
            survivor = Survivor.objects.create(
                name=f"Survivor {i}",
                age=random.randint(18, 80),
                gender=random.choice(['M', 'F', 'O']),
                latitude=round(random.uniform(-90, 90), 4),
                longitude=round(random.uniform(-180, 180), 4),
                is_infected=False,
            )

            # Add random inventory items for each survivor
            for _ in range(random.randint(1, 4)):
                self.add_or_update_inventory(
                    survivor=survivor,
                    item=random.choice([Item.WATER, Item.FOOD, Item.MEDICATION, Item.AMMUNITION]),
                    quantity=random.randint(1, 10)
                )

        logger.debug('Successfully added 10 survivors with inventory!')

    def add_or_update_inventory(self, survivor, item, quantity):
        """
        Adds a new inventory item for a survivor or updates the quantity if the item already exists.
        """
        # Check if an inventory item of this type already exists for the survivor
        inventory_item, created = Inventory.objects.get_or_create(
            survivor=survivor,
            item=item,
            defaults={'quantity': quantity}
        )

        # If the inventory item already exists, update its quantity
        if not created:
            inventory_item.quantity += quantity
            inventory_item.save()
