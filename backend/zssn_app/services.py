import logging
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError
from django.db import transaction
from .models import Survivor, Inventory, Item
from .constants import REPORTS_TO_MARK_INFECTED

# Configure logging
logger = logging.getLogger(__name__)

class SurvivorService:

    def update_location(self, survivor, latitude, longitude):
        logger.debug(f"Updating location for survivor {survivor.id} to latitude: {latitude}, longitude: {longitude}")
        survivor.latitude = latitude
        survivor.longitude = longitude
        try:
            survivor.full_clean()
            survivor.save()
            logger.info(f"Updated location for survivor {survivor.id}")
            return survivor
        except DjangoValidationError as e:
            logger.error(f"Validation error while updating location for survivor {survivor.id}: {e}")
            raise ValidationError(e)

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

        points_a = Inventory.calculate_total_worth(self.items_to_trade_from_a)
        points_b = Inventory.calculate_total_worth(self.items_to_trade_from_b)

        if points_a != points_b:
            logger.warning("Trade restriction: The trade is not balanced.")
            return "The trade is not balanced."

        if not self.items_to_trade_from_a and not self.items_to_trade_from_b:
            logger.warning("Trade restriction: No items to exchange.")
            return "No items to exchange."

        return None

    def execute_trade(self):
        restriction = self.get_trade_restriction()
        if restriction:
            logger.error(f"Trade execution failed: {restriction}")
            raise ValidationError(restriction)

        logger.debug(f"Executing trade between survivor {self.survivor_a.id} and survivor {self.survivor_b.id}")

        with transaction.atomic():
            self._transfer_items(self.survivor_a, self.survivor_b, self.items_to_trade_from_a)
            self._transfer_items(self.survivor_b, self.survivor_a, self.items_to_trade_from_b)

        logger.info(f"Trade executed successfully between survivor {self.survivor_a.id} and survivor {self.survivor_b.id}")
        return True

    def _transfer_items(self, from_survivor, to_survivor, items):
        """
        Transfer items from one survivor to another.

        :param items: A dictionary with item names as keys and quantities as values.
        """
        for item, quantity in items.items():
            normalized_item_name = item.strip().upper()
            try:
                from_inventory = Inventory.objects.get(survivor=from_survivor, item=normalized_item_name)
            except Inventory.DoesNotExist:
                logger.error(f"Inventory item '{normalized_item_name}' does not exist for survivor {from_survivor.id}")
                raise ValidationError(f"Inventory item '{normalized_item_name}' does not exist for survivor {from_survivor.id}")

            to_inventory, created = Inventory.objects.get_or_create(survivor=to_survivor, item=normalized_item_name, defaults={'quantity': 0})

            if from_inventory.quantity < quantity:
                logger.error(f"Insufficient quantity of {normalized_item_name} for survivor {from_survivor.id}")
                raise ValidationError(f"Insufficient quantity of {normalized_item_name} for survivor {from_survivor.id}")

            from_inventory.quantity -= quantity
            to_inventory.quantity += quantity

            from_inventory.save()
            to_inventory.save()