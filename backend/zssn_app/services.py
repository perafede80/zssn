import logging
from rest_framework.exceptions import ValidationError
from .models import Survivor, Inventory, Item
from .constants import REPORTS_TO_MARK_INFECTED

# Configure logging
logger = logging.getLogger(__name__)

class SurvivorService:

    def update_location(self, survivor, latitude, longitude):
        logger.debug(f"Updating location for survivor {survivor.id} to latitude: {latitude}, longitude: {longitude}")
        survivor.latitude = latitude
        survivor.longitude = longitude
        survivor.full_clean()
        survivor.save()
        logger.info(f"Updated location for survivor {survivor.id}")
        return survivor

    def report_infection(self, survivor, reporter_id):
        logger.debug(f"Reporting infection for survivor {survivor.id} by reporter {reporter_id}")
        try:
            reporter = Survivor.objects.get(id=reporter_id, is_infected=False)
        except Survivor.DoesNotExist:
            logger.warning(f"Invalid reporter ID {reporter_id} or reporter is infected.")
            raise ValidationError("Invalid reporter ID or reporter is infected.")

        if survivor == reporter:
            logger.warning(f"Survivor {survivor.id} attempted to self-report infection.")
            raise ValidationError("A survivor cannot report themselves.")

        survivor.reports_count += 1

        if survivor.reports_count >= REPORTS_TO_MARK_INFECTED:
            survivor.is_infected = True
            logger.info(f"Survivor {survivor.id} marked as infected.")

        survivor.save()
        logger.info(f"Reported infection for survivor {survivor.id}")
        return survivor

class TradeService:

    def __init__(self, survivor_a, survivor_b, items_to_trade_from_a, items_to_trade_from_b):
        logger.debug(f"Initializing trade between survivor {survivor_a.id} and survivor {survivor_b.id}")
        self.survivor_a = survivor_a
        self.survivor_b = survivor_b
        self.items_to_trade_from_a = items_to_trade_from_a
        self.items_to_trade_from_b = items_to_trade_from_b

    def can_trade(self):
        return self.get_trade_restriction() is None

    def get_trade_restriction(self):
        if self.survivor_a.is_infected or self.survivor_b.is_infected:
            logger.warning("Trade restriction: One of the traders is infected.")
            return "One of the traders is infected."

        points_a = self.calculate_trade_points(self.items_to_trade_from_a)
        points_b = self.calculate_trade_points(self.items_to_trade_from_b)

        if points_a != points_b:
            logger.warning("Trade restriction: The trade is not balanced.")
            return "The trade is not balanced."

        if not self.items_to_trade_from_a and not self.items_to_trade_from_b:
            logger.warning("Trade restriction: No items to exchange.")
            return "No items to exchange."

        return None

    def calculate_trade_points(self, items):
        return sum(items.get(item, 0) * price for item, price in {
            'WATER': 4, 'FOOD': 3, 'MEDICATION': 2, 'AMMUNITION': 1
        }.items())

    def execute_trade(self):
        restriction = self.get_trade_restriction()
        if restriction:
            logger.error(f"Trade execution failed: {restriction}")
            raise ValidationError(restriction)

        logger.debug(f"Executing trade between survivor {self.survivor_a.id} and survivor {self.survivor_b.id}")

        for item, amount in self.items_to_trade_from_a.items():
            normalized_item = item.upper()
            inventory_entry_a = Inventory.objects.get(survivor=self.survivor_a, item=normalized_item)
            inventory_entry_a.quantity -= amount
            inventory_entry_a.save()

            inventory_entry_b = Inventory.objects.get(survivor=self.survivor_b, item=normalized_item)
            inventory_entry_b.quantity += amount
            inventory_entry_b.save()

        for item, amount in self.items_to_trade_from_b.items():
            normalized_item = item.upper()
            inventory_entry_b = Inventory.objects.get(survivor=self.survivor_b, item=normalized_item)
            inventory_entry_b.quantity -= amount
            inventory_entry_b.save()

            inventory_entry_a = Inventory.objects.get(survivor=self.survivor_a, item=normalized_item)
            inventory_entry_a.quantity += amount
            inventory_entry_a.save()

        logger.info(f"Trade executed successfully between survivor {self.survivor_a.id} and survivor {self.survivor_b.id}")
        return True