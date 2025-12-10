import logging

from django.test import TestCase
from rest_framework.test import APIClient

from .helper import (
    DEFAULT_AMMUNITION_QUANTITY,
    DEFAULT_FOOD_QUANTITY,
    DEFAULT_MEDICATION_QUANTITY,
    DEFAULT_WATER_QUANTITY,
    create_survivor_with_inventory,
    create_survivor_with_specific_inventory,
)

# Configure logging
logger = logging.getLogger(__name__)


class UpdateSurvivorLocationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.survivor = create_survivor_with_inventory(latitude=40.7128, longitude=-74.0060)
        self.survivor_with_specific_inventory = create_survivor_with_specific_inventory(
            water_qty=DEFAULT_WATER_QUANTITY,
            food_qty=DEFAULT_FOOD_QUANTITY,
            medication_qty=DEFAULT_MEDICATION_QUANTITY,
            ammunition_qty=DEFAULT_AMMUNITION_QUANTITY)

    def test_update_location(self):
        """Update the location with an allowed latitude and longitude"""
        logger.info("\n***** Update the location with an allowed latitude and longitude *****")

        url = f'/api/survivors/{self.survivor.id}/update_location/'
        data = {
            'latitude': 40.7129,
            'longitude': -74.0061
        }

        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200)

        # Refresh the survivor from the database
        self.survivor.refresh_from_db()
        self.assertEqual(self.survivor.latitude, 40.7129)
        self.assertEqual(self.survivor.longitude, -74.0061)

        logger.info("Completed test_update_location")

    def test_update_location_with_invalid_latitude(self):
        """Test updating location with an invalid latitude (out of range)."""
        logger.info("\n***** Test updating location with an invalid latitude (out of range). *****")

        url = f'/api/survivors/{self.survivor.id}/update_location/'
        data = {
            'latitude': 100,  # Invalid latitude (greater than 90)
            'longitude': -74.0061
        }

        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 400)  # Expect a bad request response

        # Ensure the survivor's location remains unchanged
        self.survivor.refresh_from_db()
        self.assertEqual(self.survivor.latitude, 40.7128)
        self.assertEqual(self.survivor.longitude, -74.0060)

        logger.info("Completed test_update_location_with_invalid_latitude")

    def test_update_location_with_invalid_longitude(self):
        """Test updating location with an invalid longitude (out of range)."""
        logger.info("\n***** Test updating location with an invalid longitude (out of range). *****")

        url = f'/api/survivors/{self.survivor.id}/update_location/'
        data = {
            'latitude': 40.7129,
            'longitude': -200  # Invalid longitude (less than -180)
        }

        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 400)  # Expect a bad request response

        # Ensure the survivor's location remains unchanged
        self.survivor.refresh_from_db()
        self.assertEqual(self.survivor.latitude, 40.7128)
        self.assertEqual(self.survivor.longitude, -74.0060)

        logger.info("Completed test_update_location_with_invalid_longitude")

    def test_invalid_update_through_serializer(self):
        """Test the attempt to update inventory directly through the serializer."""
        logger.info("\n***** Test the attempt to update inventory directly through the serializer. *****")

        # Attempt to update the survivor's inventory via the serializer
        url = f'/api/survivors/{self.survivor_with_specific_inventory.id}/update_location/'
        data = {
            "latitude": 40.7129,
            "longitude": -74.0061,
            "inventory": [{"item": "WATER", "quantity": 10}]
        }
        self.client.put(url, data, format='json')

        # Verify that the inventory remains unchanged
        self.survivor_with_specific_inventory.refresh_from_db()
        updated_inventory = self.survivor_with_specific_inventory.get_inventory()
        expected_inventory = {
            'WATER': DEFAULT_WATER_QUANTITY,
            'FOOD': DEFAULT_FOOD_QUANTITY,
            'MEDICATION': DEFAULT_MEDICATION_QUANTITY,
            'AMMUNITION': DEFAULT_AMMUNITION_QUANTITY,
        }
        self.assertDictEqual(updated_inventory, expected_inventory)

        logger.info("Completed test_invalid_update_through_serializer")