import logging

from django.test import TestCase

from zssn_app.serializer import SurvivorSerializer

from .helper import (
    DEFAULT_AMMUNITION_QUANTITY,
    DEFAULT_FOOD_QUANTITY,
    DEFAULT_MEDICATION_QUANTITY,
    DEFAULT_WATER_QUANTITY,
    create_survivor_with_inventory,
    create_survivor_with_specific_inventory,
)

logger = logging.getLogger(__name__)
class SurvivorSerializerTest(TestCase):

    def setUp(self):

        self.survivor = create_survivor_with_inventory()
        self.survivor_with_specific_inventory = create_survivor_with_specific_inventory(water_qty=DEFAULT_WATER_QUANTITY,
                                                                                        food_qty=DEFAULT_FOOD_QUANTITY,
                                                                                        medication_qty=DEFAULT_MEDICATION_QUANTITY,
                                                                                        ammunition_qty=DEFAULT_AMMUNITION_QUANTITY)
    def test_serializer_valid_gender(self):
        """Test the serializer accepts valid gender."""
        logger.info("\n***** Test the serializer accepts valid gender. *****")
        valid_data = {
            "name": "Valid Gender",
            "age": 30,
            "gender": "M",  # Valid gender
            "latitude": 40.7128,
            "longitude": -74.0060,
            "inventory": [
                {"item": "WATER", "quantity": 2},
                {"item": "FOOD", "quantity": 3},
            ],
        }
        serializer = SurvivorSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid())
        logger.info("Completed test_serializer_valid_gender")

    def test_serializer_invalid_gender(self):
        """Test the serializer rejects invalid gender."""
        logger.info("\n***** Test the serializer rejects invalid gender. *****")
        invalid_data = {
            "name": "Invalid Gender",
            "age": 45,
            "gender": "X",  # Invalid gender
            "latitude": 77.5824,
            "longitude": 156.9807,
            "inventory": [
                {"item": "WATER", "quantity": 2},
                {"item": "FOOD", "quantity": 3},
            ],
        }
        serializer = SurvivorSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("gender", serializer.errors)  # Ensure the error is for the 'gender' field
        logger.info("Completed test_serializer_invalid_gender")

    def test_update_survivor_valid_data(self):
        """Test updating a survivor's details with valid data."""
        logger.info("\n***** Test updating a survivor's details with valid data. *****")
        initial_inventory = self.survivor.get_inventory()

        # Data for the update
        update_data = {
            "name": "John Updated",
            "age": 35,
            "gender": "F",  # Valid gender change
            "latitude": 41.0,
            "longitude": -75.0,
            "inventory": [{"item": "WATER", "quantity": 10}]  # Attempt to update inventory
        }

        # Serialize and update the survivor
        serializer = SurvivorSerializer(instance=self.survivor, data=update_data, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_survivor = serializer.save()

        # Verify that the survivor's details are updated
        self.assertEqual(updated_survivor.name, "John Updated")
        self.assertEqual(updated_survivor.age, 35)
        self.assertEqual(updated_survivor.gender, "F")
        self.assertEqual(updated_survivor.latitude, 41.0)
        self.assertEqual(updated_survivor.longitude, -75.0)

        # Verify that the inventory remains unchanged
        updated_inventory = updated_survivor.get_inventory()
        self.assertDictEqual(updated_inventory, initial_inventory)

        logger.info("Completed test_update_survivor_valid_data")

    def test_update_survivor_partial_update(self):
        """Test a partial update of a survivor's details."""
        logger.info("\n***** Test a partial update of a survivor's details. *****")
        initial_inventory = self.survivor.get_inventory()

        # Data for the partial update
        update_data = {
            "latitude": 42.0,
            "longitude": -76.0,
        }

        # Serialize and update the survivor
        serializer = SurvivorSerializer(instance=self.survivor, data=update_data, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_survivor = serializer.save()

        # Verify that only the specified fields are updated
        self.assertEqual(updated_survivor.latitude, 42.0)
        self.assertEqual(updated_survivor.longitude, -76.0)

        # Verify that other fields remain unchanged
        self.assertEqual(updated_survivor.name, self.survivor.name)
        self.assertEqual(updated_survivor.age, self.survivor.age)
        self.assertEqual(updated_survivor.gender, self.survivor.gender)

        # Verify that the inventory remains unchanged
        updated_inventory = updated_survivor.get_inventory()
        self.assertDictEqual(updated_inventory, initial_inventory)

        logger.info("Completed test_update_survivor_partial_update")