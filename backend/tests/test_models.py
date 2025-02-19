from django.test import TestCase
from zssn_app.models import Survivor, Inventory, Item

class SurvivorModelTest(TestCase):
    def setUp(self):
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

    def test_item_points(self):
        """Test the point value of items."""
        self.assertEqual(Item.get_points(Item.WATER), 4)
        self.assertEqual(Item.get_points(Item.FOOD), 3)
        self.assertEqual(Item.get_points(Item.MEDICATION), 2)
        self.assertEqual(Item.get_points(Item.AMMUNITION), 1)

    def test_inventory_total_points(self):
        """Test calculating total points for a survivor's inventory."""
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

    def test_inventory_contents(self):
        """Test that the survivor's inventory contains the correct items and quantities."""
        inventory = {item.item: item.quantity for item in self.survivor.inventory.all()}
        expected_inventory = {
            Item.WATER: 2,
            Item.FOOD: 3,
            Item.MEDICATION: 1,
            Item.AMMUNITION: 5,
        }
        self.assertDictEqual(inventory, expected_inventory)