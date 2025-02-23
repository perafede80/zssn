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
            for _ in range(random.randint(1, 5)):
                Inventory.objects.create(
                    survivor=survivor,
                    item=random.choice([Item.WATER, Item.FOOD, Item.MEDICATION, Item.AMMUNITION]),
                    quantity=random.randint(1, 10)
                )

        logger.debug('Successfully added 10 survivors with inventory!')

