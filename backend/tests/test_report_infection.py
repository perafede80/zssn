from django.test import TestCase
from rest_framework.test import APIClient
from zssn_app.models import Survivor, Inventory, Item

class ReportInfectionTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create the target survivor (to be reported)
        self.target_survivor = Survivor.objects.create(
            name="John Doe",
            age=25,
            gender="M",
            latitude=40.7128,
            longitude=-74.0060
        )

        # Create three reporting survivors
        self.reporter_1 = Survivor.objects.create(
            name="Reporter 1",
            age=30,
            gender="F",
            latitude=34.0522,
            longitude=-118.2437
        )
        self.reporter_2 = Survivor.objects.create(
            name="Reporter 2",
            age=35,
            gender="M",
            latitude=36.1699,
            longitude=-115.1398
        )
        self.reporter_3 = Survivor.objects.create(
            name="Reporter 3",
            age=40,
            gender="F",
            latitude=37.7749,
            longitude=-122.4194
        )

        # populate the inventory for each survivors

        # Populate the survivor's inventory
        self.inventory_items = [
            {"item": Item.WATER, "quantity": 2},
            {"item": Item.FOOD, "quantity": 3},
            {"item": Item.MEDICATION, "quantity": 1},
            {"item": Item.AMMUNITION, "quantity": 5},
        ]

        for item_data in self.inventory_items:
            Inventory.objects.create(survivor=self.target_survivor, item=item_data["item"], quantity=item_data["quantity"])
            Inventory.objects.create(survivor=self.reporter_1, item=item_data["item"], quantity=item_data["quantity"])
            Inventory.objects.create(survivor=self.reporter_2, item=item_data["item"], quantity=item_data["quantity"])
            Inventory.objects.create(survivor=self.reporter_3, item=item_data["item"], quantity=item_data["quantity"])

    def test_report_infection(self):
        url = f'/api/survivors/{self.target_survivor.id}/report_infection/'

        # Reporter 1 reports the target survivor
        data = {'reporter_id': self.reporter_1.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)

        # Refresh the target survivor from the database
        self.target_survivor.refresh_from_db()
        self.assertEqual(self.target_survivor.reports_count, 1)
        self.assertFalse(self.target_survivor.is_infected)  # Not infected yet

        # Reporter 2 reports the target survivor
        data = {'reporter_id': self.reporter_2.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)

        # Refresh the target survivor from the database
        self.target_survivor.refresh_from_db()
        self.assertEqual(self.target_survivor.reports_count, 2)
        self.assertFalse(self.target_survivor.is_infected)  # Still not infected

        # Reporter 3 reports the target survivor
        data = {'reporter_id': self.reporter_3.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)

        # Refresh the target survivor from the database
        self.target_survivor.refresh_from_db()
        self.assertEqual(self.target_survivor.reports_count, 3)
        self.assertTrue(self.target_survivor.is_infected)  # Now infected

    def test_cannot_report_themselves(self):
        url = f'/api/survivors/{self.target_survivor.id}/report_infection/'
        data = {'reporter_id': self.target_survivor.id}  # Trying to report themselves
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)  # Expect a validation error

        # Ensure the target survivor's reports_count hasn't changed
        self.target_survivor.refresh_from_db()
        self.assertEqual(self.target_survivor.reports_count, 0)
        self.assertFalse(self.target_survivor.is_infected)

    def test_invalid_reporter(self):
        url = f'/api/survivors/{self.target_survivor.id}/report_infection/'
        data = {'reporter_id': 9999}  # Invalid reporter ID
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)  # Expect a validation error

        # Ensure the target survivor's reports_count hasn't changed
        self.target_survivor.refresh_from_db()
        self.assertEqual(self.target_survivor.reports_count, 0)
        self.assertFalse(self.target_survivor.is_infected)