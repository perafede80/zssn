import logging
from django.test import TestCase
from rest_framework.test import APIClient
from zssn_app.models import Survivor, Item, Inventory

# Configure logging
logger = logging.getLogger(__name__)


class UpdateSurvivorLocationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.survivor = Survivor.objects.create(
            name="John Doe",
            age=25,
            gender="M",
            latitude=40.7128,
            longitude=-74.0060
        )

        # Populate the survivor's inventory
        self.inventory_items = [
            {"item": Item.WATER, "quantity": 2},
            {"item": Item.FOOD, "quantity": 3},
            {"item": Item.MEDICATION, "quantity": 1},
            {"item": Item.AMMUNITION, "quantity": 5},
        ]

        for item_data in self.inventory_items:
            Inventory.objects.create(survivor=self.survivor, item=item_data["item"], quantity=item_data["quantity"])

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