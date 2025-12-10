import logging
import random

from django.core.management.base import BaseCommand

from zssn_app.models import Inventory, Item, Survivor

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
            self.add_random_inventory(survivor)

        logger.debug('Successfully seeded 10 survivors with inventory!')

    def add_random_inventory(self, survivor):
        """
        Adds a set of unique random inventory items for a survivor.
        """
        available_items = [Item.WATER, Item.FOOD, Item.MEDICATION, Item.AMMUNITION]
        num_items = random.randint(1, len(available_items))
        selected_items = random.sample(available_items, num_items)

        for item in selected_items:
            quantity = random.randint(1, 10)
            Inventory.objects.create(survivor=survivor, item=item, quantity=quantity)

