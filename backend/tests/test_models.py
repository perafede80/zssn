import logging

from django.core.exceptions import ValidationError
from django.test import TestCase

from zssn_app.constants import (
    AMMUNITION_POINTS,
    FOOD_POINTS,
    MEDICATION_POINTS,
    WATER_POINTS,
)
from zssn_app.models import Item, Survivor

from .helper import (
    DEFAULT_AMMUNITION_QUANTITY,
    DEFAULT_FOOD_QUANTITY,
    DEFAULT_MEDICATION_QUANTITY,
    DEFAULT_WATER_QUANTITY,
    create_survivor_with_inventory,
    create_survivor_with_specific_inventory,
)

logger = logging.getLogger(__name__)

class SurvivorModelTest(TestCase):
    def setUp(self):

        self.survivor = create_survivor_with_inventory()
        self.survivor_with_specific_inventory = create_survivor_with_specific_inventory(water_qty=DEFAULT_WATER_QUANTITY,
                                                                                        food_qty=DEFAULT_FOOD_QUANTITY,
                                                                                        medication_qty=DEFAULT_MEDICATION_QUANTITY,
                                                                                        ammunition_qty=DEFAULT_AMMUNITION_QUANTITY)

    def test_invalid_gender(self):
        """Test the attempt to create a survivor with an incorrect gender."""
        logger.info("\n***** Test the attempt to create a survivor with an invalid gender. *****")

        unicorn_survivor_data = {
                "name": "John Doe",
                "age": 45,
                "gender": "U",
                "latitude": 77.5824,
                "longitude": 156.9807,
                "is_infected": False
        }

        with self.assertRaises(ValidationError):
            survivor = Survivor(**unicorn_survivor_data)
            survivor.full_clean()
        logger.info("Completed test_invalid_gender")

    def test_invalid_latitude(self):
        """Test the attempt to create a survivor with an invalid latitude."""
        logger.info("\n***** Test the attempt to create a survivor with an invalid latitude. *****")
        invalid_data = {
            "name": "Invalid Latitude",
            "age": 45,
            "gender": "M",
            "latitude": 100,
            "longitude": -74.0060,
            "is_infected": False
        }
        with self.assertRaises(ValidationError):
            survivor = Survivor(**invalid_data)
            survivor.full_clean()
        logger.info("Completed test_invalid_latitude")

    def test_invalid_longitude(self):
        """Test the attempt to create a survivor with an invalid longitude."""
        logger.info("\n***** Test the attempt to create a survivor with an invalid longitude. *****")
        invalid_data = {
            "name": "Invalid Longitude",
            "age": 45,
            "gender": "M",
            "latitude": 40.7128,
            "longitude": -200,
            "is_infected": False
        }
        with self.assertRaises(ValidationError):
            survivor = Survivor(**invalid_data)
            survivor.full_clean()
        logger.info("Completed test_invalid_longitude")

    def test_item_points(self):
        """Test the point value of items."""
        logger.info("\n***** Test the point value of items. *****")
        self.assertEqual(Item.get_points(Item.WATER), WATER_POINTS)
        self.assertEqual(Item.get_points(Item.FOOD), FOOD_POINTS)
        self.assertEqual(Item.get_points(Item.MEDICATION), MEDICATION_POINTS)
        self.assertEqual(Item.get_points(Item.AMMUNITION), AMMUNITION_POINTS)
        logger.info("Completed test_item_points")

    def test_inventory_total_points(self):
        """Test calculating total points for a survivor's inventory."""
        logger.info("\n***** Test calculating total points for a survivor's inventory. *****")
        inventory = self.survivor_with_specific_inventory.get_inventory()
        total_points = sum(Item.get_points(item) * quantity for item, quantity in inventory.items())
        expected_points = (
                (DEFAULT_WATER_QUANTITY * Item.get_points(Item.WATER)) +
                (DEFAULT_FOOD_QUANTITY * Item.get_points(Item.FOOD)) +
                (DEFAULT_MEDICATION_QUANTITY * Item.get_points(Item.MEDICATION)) +
                (DEFAULT_AMMUNITION_QUANTITY * Item.get_points(Item.AMMUNITION))
        )
        self.assertEqual(total_points, expected_points)
        logger.info("Completed test_inventory_total_points")

    def test_inventory_contents(self):
        """Test that the survivor's inventory contains the correct items and quantities."""
        logger.info("\n***** Test that the survivor's inventory contains the correct items and quantities. *****")
        inventory = self.survivor_with_specific_inventory.get_inventory()
        expected_inventory = {
            'WATER': DEFAULT_WATER_QUANTITY,
            'FOOD': DEFAULT_FOOD_QUANTITY,
            'MEDICATION': DEFAULT_MEDICATION_QUANTITY,
            'AMMUNITION': DEFAULT_AMMUNITION_QUANTITY,
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