import logging

from django.test import TestCase
from rest_framework.test import APIClient

from .helper import (
    DEFAULT_AMMUNITION_QUANTITY,
    DEFAULT_FOOD_QUANTITY,
    DEFAULT_MEDICATION_QUANTITY,
    DEFAULT_WATER_QUANTITY,
    create_survivor_with_specific_inventory,
)

# Configure logging
logger = logging.getLogger(__name__)


class TradeSurvivorsTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create two survivors with inventories
        self.survivor_a = create_survivor_with_specific_inventory(
            water_qty=DEFAULT_WATER_QUANTITY,
            food_qty=DEFAULT_FOOD_QUANTITY,
            medication_qty=DEFAULT_MEDICATION_QUANTITY,
            ammunition_qty=DEFAULT_AMMUNITION_QUANTITY)

        self.survivor_b = create_survivor_with_specific_inventory(
            water_qty=DEFAULT_WATER_QUANTITY,
            food_qty=DEFAULT_FOOD_QUANTITY,
            medication_qty=DEFAULT_MEDICATION_QUANTITY,
            ammunition_qty=DEFAULT_AMMUNITION_QUANTITY)

        # Create an infected survivor
        self.survivor_c = create_survivor_with_specific_inventory(
            is_infected=True,
            water_qty=DEFAULT_WATER_QUANTITY,
            food_qty=DEFAULT_FOOD_QUANTITY,
            medication_qty=DEFAULT_MEDICATION_QUANTITY,
            ammunition_qty=DEFAULT_AMMUNITION_QUANTITY)

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
        self.assertEqual(inventory_a.get("WATER", 0), DEFAULT_WATER_QUANTITY)
        self.assertEqual(inventory_b.get("AMMUNITION", 0), DEFAULT_AMMUNITION_QUANTITY)
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
        logger.info(f"survivor c is infected {self.survivor_c.is_infected}")
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "One of the traders is infected.")

        # Refresh survivors
        self.survivor_a.refresh_from_db()
        self.survivor_c.refresh_from_db()

        inventory_a = self.survivor_a.get_inventory()
        inventory_c = self.survivor_c.get_inventory()

        # Ensure inventories remain unchanged
        self.assertEqual(inventory_a.get("WATER", 0), DEFAULT_WATER_QUANTITY)
        self.assertEqual(inventory_c.get("AMMUNITION", 0), DEFAULT_AMMUNITION_QUANTITY)
        logger.info("Completed test_trade_with_infected_survivor")