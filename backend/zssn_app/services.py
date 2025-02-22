from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError
from .models import Survivor, Inventory, Item
from .constants import REPORTS_TO_MARK_INFECTED

class SurvivorService:

    def update_location(self, survivor, latitude, longitude):
        survivor.latitude = latitude
        survivor.longitude = longitude
        survivor.full_clean()
        survivor.save()
        return survivor

    def report_infection(self, survivor, reporter_id):
        try:
            reporter = Survivor.objects.get(id=reporter_id, is_infected=False)
        except Survivor.DoesNotExist:
            raise ValidationError("Invalid reporter ID or reporter is infected.")

        if survivor == reporter:
            raise ValidationError("A survivor cannot report themselves.")

        survivor.reports_count += 1

        if survivor.reports_count >= REPORTS_TO_MARK_INFECTED:
            survivor.is_infected = True

        survivor.save()
        return survivor

class TradeService:

    def __init__(self, survivor_a, survivor_b, items_a, items_b):
        self.survivor_a = survivor_a
        self.survivor_b = survivor_b
        self.items_a = items_a
        self.items_b = items_b

    def is_possible(self):
        return self.why_not_possible() is None

    def why_not_possible(self):
        if self.survivor_a.is_infected or self.survivor_b.is_infected:
            return "One of the traders is infected."

        points_a = self.calculate_trade_points(self.items_a)
        points_b = self.calculate_trade_points(self.items_b)

        if points_a != points_b:
            return "The trade is not balanced."

        if not self.items_a and not self.items_b:
            return "Nothing to exchange."

        return None

    def calculate_trade_points(self, items):
        return sum(items.get(item, 0) * price for item, price in {
            'WATER': 4, 'FOOD': 3, 'MEDICATION': 2, 'AMMUNITION': 1
        }.items())

    def perform_trade(self):
        if not self.is_possible():
            raise ValidationError(self.why_not_possible())

        for item, amount in self.items_a.items():
            normalized_item = item.upper()
            inventory_entry_a = Inventory.objects.get(survivor=self.survivor_a, item=normalized_item)
            inventory_entry_a.quantity -= amount
            inventory_entry_a.save()

            inventory_entry_b = Inventory.objects.get(survivor=self.survivor_b, item=normalized_item)
            inventory_entry_b.quantity += amount
            inventory_entry_b.save()

        for item, amount in self.items_b.items():
            normalized_item = item.upper()
            inventory_entry_b = Inventory.objects.get(survivor=self.survivor_b, item=normalized_item)
            inventory_entry_b.quantity -= amount
            inventory_entry_b.save()

            inventory_entry_a = Inventory.objects.get(survivor=self.survivor_a, item=normalized_item)
            inventory_entry_a.quantity += amount
            inventory_entry_a.save()

        return True