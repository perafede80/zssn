import logging
from django.core.exceptions import ValidationError
from django.test import TestCase
from zssn_app.models import Survivor, Inventory, Item
from .helper import create_survivor_with_inventory, create_survivor_with_specific_inventory

# Configure logging
logger = logging.getLogger(__name__)


class SurvivorModelTest(TestCase):
    def setUp(self):
        # Create a survivor
        self.survivor = create_survivor_with_inventory()
        self.survivor_with_specific_inventory = create_survivor_with_specific_inventory(water_qty=2, food_qty=3, medication_qty=1, ammunition_qty=5)

    def test_item_points(self):
        """Test the point value of items."""
        logger.info("\n***** Test the point value of items. *****")
        self.assertEqual(Item.get_points(Item.WATER), 4)
        self.assertEqual(Item.get_points(Item.FOOD), 3)
        self.assertEqual(Item.get_points(Item.MEDICATION), 2)
        self.assertEqual(Item.get_points(Item.AMMUNITION), 1)
        logger.info("Completed test_item_points")

    def test_inventory_total_points(self):
        """Test calculating total points for a survivor's inventory."""
        logger.info("\n***** Test calculating total points for a survivor's inventory. *****")
        inventory = self.survivor_with_specific_inventory.get_inventory()
        total_points = sum(Item.get_points(item) * quantity for item, quantity in inventory.items())
        expected_points = (
                (2 * Item.get_points(Item.WATER)) +
                (3 * Item.get_points(Item.FOOD)) +
                (1 * Item.get_points(Item.MEDICATION)) +
                (5 * Item.get_points(Item.AMMUNITION))
        )
        self.assertEqual(total_points, expected_points)
        logger.info("Completed test_inventory_total_points")

    def test_inventory_contents(self):
        """Test that the survivor's inventory contains the correct items and quantities."""
        logger.info("\n***** Test that the survivor's inventory contains the correct items and quantities. *****")
        inventory = self.survivor_with_specific_inventory.get_inventory()
        expected_inventory = {
            'WATER': 2,
            'FOOD': 3,
            'MEDICATION': 1,
            'AMMUNITION': 5,
        }
        self.assertDictEqual(inventory, expected_inventory)
        logger.info("Completed test_inventory_contents")

    def test_empty_inventory(self):
        """Test the behavior when the inventory is empty."""
        logger.info("\n***** Test the behavior when the inventory is empty. *****")
        self.survivor.inventory.all().delete()
        inventory = self.survivor.get_inventory()
        self.assertEqual(inventory, {})
        total_points = sum(Item.get_points(item) * quantity for item, quantity in inventory.items())
        self.assertEqual(total_points, 0)
        logger.info("Completed test_empty_inventory")

    def test_infected_status(self):
        """Test the behavior of the infected status."""
        logger.info("\n***** Test the behavior of the infected status. *****")
        self.assertFalse(self.survivor.is_infected)
        self.survivor.is_infected = True
        self.survivor.save()
        self.assertTrue(Survivor.objects.get(id=self.survivor.id).is_infected)
        logger.info("Completed test_infected_status")