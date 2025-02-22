import logging
from django.test import TestCase
from rest_framework.test import APIClient
from zssn_app.models import Survivor, Inventory, Item

# Configure logging
logger = logging.getLogger(__name__)


class TradeSurvivorsTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create two survivors with inventories
        self.survivor_a = Survivor.objects.create(
            name="John Doe",
            age=25,
            gender="M",
            latitude=40.7128,
            longitude=-74.0060,
            is_infected=False
        )

        self.survivor_b = Survivor.objects.create(
            name="Jane Smith",
            age=30,
            gender="F",
            latitude=34.0522,
            longitude=-118.2437,
            is_infected=False
        )

        # Create an infected survivor
        self.survivor_c = Survivor.objects.create(
            name="Mike Johnson",
            age=40,
            gender="M",
            latitude=51.5074,
            longitude=-0.1278,
            is_infected=True  # Marked as infected
        )

        # Populate the survivors' inventories
        self.inventory_items = [
            {"item": Item.WATER, "quantity": 2},
            {"item": Item.FOOD, "quantity": 3},
            {"item": Item.MEDICATION, "quantity": 1},
            {"item": Item.AMMUNITION, "quantity": 5},
        ]

        for item_data in self.inventory_items:
            Inventory.objects.create(survivor=self.survivor_a, item=item_data["item"], quantity=item_data["quantity"])
            Inventory.objects.create(survivor=self.survivor_b, item=item_data["item"], quantity=item_data["quantity"])
            Inventory.objects.create(survivor=self.survivor_c, item=item_data["item"], quantity=item_data["quantity"])

    def test_valid_trade(self):
        """Test a valid trade between two survivors."""
        logger.info("\n***** Test a valid trade between two survivors. *****")
        url = f'/api/survivors/{self.survivor_a.id}/trade_items/'

        data = {
            "survivor_b_id": self.survivor_b.id,
            "items_from_a": {"WATER": 1, "FOOD": 1},
            "items_from_b": {"AMMUNITION": 5, "MEDICATION": 1}
        }

        inventory_a = self.survivor_a.get_inventory()
        inventory_b = self.survivor_b.get_inventory()

        # Ensure the trade is within the available inventory
        if (
                inventory_a.get("WATER", 0) >= data["items_from_a"].get("WATER", 0) and
                inventory_a.get("FOOD", 0) >= data["items_from_a"].get("FOOD", 0) and
                inventory_b.get("MEDICATION", 0) >= data["items_from_b"].get("MEDICATION", 0) and
                inventory_b.get("AMMUNITION", 0) >= data["items_from_b"].get("AMMUNITION", 0)
        ):
            response = self.client.post(url, data, format='json')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data["message"], "Trade successful.")

            # Refresh survivors
            self.survivor_a.refresh_from_db()
            self.survivor_b.refresh_from_db()
            inventory_a = self.survivor_a.get_inventory()
            inventory_b = self.survivor_b.get_inventory()

            # Verify Survivor A's inventory after the trade
            self.assertEqual(inventory_a.get("WATER", 0), 1)
            self.assertEqual(inventory_a.get("FOOD", 0), 2)
            self.assertEqual(inventory_a.get("MEDICATION", 0), 2)
            self.assertEqual(inventory_a.get("AMMUNITION", 0), 10)

            # Verify Survivor B's inventory after the trade
            self.assertEqual(inventory_b.get("WATER", 0), 3)
            self.assertEqual(inventory_b.get("FOOD", 0), 4)
            self.assertEqual(inventory_b.get("MEDICATION", 0), 0)
            self.assertEqual(inventory_b.get("AMMUNITION", 0), 0)
        else:
            self.fail("Trade request exceeds available inventory.")
        logger.info("Completed test_valid_trade")

    def test_unbalanced_trade(self):
        """Test an unbalanced trade (different points)."""
        logger.info("\n***** Test an unbalanced trade (different points). *****")
        url = f'/api/survivors/{self.survivor_a.id}/trade_items/'
        data = {
            "survivor_b_id": self.survivor_b.id,
            "items_from_a": {"WATER": 1},
            "items_from_b": {"AMMUNITION": 2}
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "The trade is not balanced.")

        # Refresh survivors
        self.survivor_a.refresh_from_db()
        self.survivor_b.refresh_from_db()

        inventory_a = self.survivor_a.get_inventory()
        inventory_b = self.survivor_b.get_inventory()

        # Ensure inventories remain unchanged
        self.assertEqual(inventory_a.get("WATER", 0), 2)
        self.assertEqual(inventory_b.get("AMMUNITION", 0), 5)
        logger.info("Completed test_unbalanced_trade")

    def test_trade_with_infected_survivor(self):
        """Test a trade involving an infected survivor."""
        logger.info("\n***** Test a trade involving an infected survivor. *****")
        url = f'/api/survivors/{self.survivor_a.id}/trade_items/'
        data = {
            "survivor_b_id": self.survivor_c.id,
            "items_from_a": {"WATER": 1},
            "items_from_b": {"AMMUNITION": 4}
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "One of the traders is infected.")

        # Refresh survivors
        self.survivor_a.refresh_from_db()
        self.survivor_c.refresh_from_db()

        inventory_a = self.survivor_a.get_inventory()
        inventory_c = self.survivor_c.get_inventory()

        # Ensure inventories remain unchanged
        self.assertEqual(inventory_a.get("WATER", 0), 2)
        self.assertEqual(inventory_c.get("AMMUNITION", 0), 5)
        logger.info("Completed test_trade_with_infected_survivor")