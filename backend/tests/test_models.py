import logging
from django.core.exceptions import ValidationError
from django.test import TestCase
from zssn_app.models import Survivor, Inventory, Item

# Configure logging
logger = logging.getLogger(__name__)


class SurvivorModelTest(TestCase):
    def setUp(self):
        logger.info("\nSetting up SurvivorModelTest...")
        # Create a survivor
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
        logger.info("Completed setting up SurvivorModelTest.")

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
        total_points = sum(
            item.quantity * Item.get_points(item.item)
            for item in self.survivor.inventory.all()
        )
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
        inventory = {item.item: item.quantity for item in self.survivor.inventory.all()}
        expected_inventory = {
            Item.WATER: 2,
            Item.FOOD: 3,
            Item.MEDICATION: 1,
            Item.AMMUNITION: 5,
        }
        self.assertDictEqual(inventory, expected_inventory)
        logger.info("Completed test_inventory_contents")

    def test_survivor_string_representation(self):
        """Test the string representation of the survivor."""
        logger.info("\n***** Test the string representation of the survivor. *****")
        self.assertEqual(str(self.survivor), "John Doe")
        logger.info("Completed test_survivor_string_representation")

    def test_inventory_string_representation(self):
        """Test the string representation of the inventory items."""
        logger.info("\n***** Test the string representation of the inventory items. *****")
        for item_data in self.inventory_items:
            item = Inventory.objects.get(survivor=self.survivor, item=item_data["item"])
            expected_string = f"Inventory ID: {item.id} - {item.item} ({item.quantity})"
            self.assertEqual(str(item), expected_string)
        logger.info("Completed test_inventory_string_representation")

    def test_empty_inventory(self):
        """Test the behavior when the inventory is empty."""
        logger.info("\n***** Test the behavior when the inventory is empty. *****")
        self.survivor.inventory.all().delete()
        self.assertEqual(self.survivor.get_inventory(), {})
        self.assertEqual(self.survivor.calculate_inventory_value(), 0)
        logger.info("Completed test_empty_inventory")

    def test_infected_status(self):
        """Test the behavior of the infected status."""
        logger.info("\n***** Test the behavior of the infected status. *****")
        self.assertFalse(self.survivor.is_infected)
        self.survivor.is_infected = True
        self.survivor.save()
        self.assertTrue(Survivor.objects.get(id=self.survivor.id).is_infected)
        logger.info("Completed test_infected_status")