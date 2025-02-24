import logging
from django.test import TestCase
from rest_framework.test import APIClient
from zssn_app.models import Survivor, Inventory, Item
from .helper import create_survivor_with_inventory

# Create a logger instance
logger = logging.getLogger(__name__)


class ReportInfectionTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create the target survivor (to be reported)
        self.target_survivor = create_survivor_with_inventory(is_infected=False)

        # Create three reporting survivors
        self.reporter_1 = create_survivor_with_inventory(is_infected=False)
        self.reporter_2 = create_survivor_with_inventory(is_infected=False)
        self.reporter_3 = create_survivor_with_inventory(is_infected=False)

    def test_report_infection(self):
        logger.info("\n***** Test successful report of a infected survivor *****")
        url = f'/api/survivors/{self.target_survivor.id}/report_infection/'

        # Reporter 1 reports the target survivor
        data = {'reporter_id': self.reporter_1.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)

        # Refresh the target survivor from the database
        self.target_survivor.refresh_from_db()
        self.assertEqual(self.target_survivor.reports_count, 1)
        self.assertFalse(self.target_survivor.is_infected)
        logger.info(
            f"After first report: Survivor {self.target_survivor.name} "
            f"has {self.target_survivor.reports_count} report(s). "
            f"Infected status: {self.target_survivor.is_infected}. "
            "Expected: Not infected."
        )

        # Reporter 2 reports the target survivor
        data = {'reporter_id': self.reporter_2.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)

        # Refresh the target survivor from the database
        self.target_survivor.refresh_from_db()
        self.assertEqual(self.target_survivor.reports_count, 2)
        self.assertFalse(self.target_survivor.is_infected)
        logger.info(
            f"After second report: Survivor {self.target_survivor.name} "
            f"has {self.target_survivor.reports_count} report(s). "
            f"Infected status: {self.target_survivor.is_infected}. "
            "Expected: Not infected."
        )

        # Reporter 3 reports the target survivor
        data = {'reporter_id': self.reporter_3.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)

        # Refresh the target survivor from the database
        self.target_survivor.refresh_from_db()
        self.assertEqual(self.target_survivor.reports_count, 3)
        self.assertTrue(self.target_survivor.is_infected)
        logger.info(
            f"After the third report: Survivor {self.target_survivor.name} "
            f"has {self.target_survivor.reports_count} report(s). "
            f"Infected status: {self.target_survivor.is_infected}. "
            "Expected: Infected."
        )

    def test_cannot_report_themselves(self):
        logger.info("\n***** Test that survivors cannot report themselves *****")
        url = f'/api/survivors/{self.target_survivor.id}/report_infection/'
        data = {'reporter_id': self.target_survivor.id}
        response = self.client.post(url, data, format='json')
        logger.info(f"Self-report response: {response.status_code}")
        self.assertEqual(response.status_code, 400)

        # Ensure the target survivor's reports_count hasn't changed
        self.target_survivor.refresh_from_db()
        self.assertEqual(self.target_survivor.reports_count, 0)
        self.assertFalse(self.target_survivor.is_infected)
        logger.info(
            f"Survivor '{self.target_survivor.name}'"
            f"still has {self.target_survivor.reports_count} reports and is not infected."
        )

    def test_invalid_reporter(self):
        logger.info("\n***** Test that only reporters in the db can create a report *****")
        url = f'/api/survivors/{self.target_survivor.id}/report_infection/'
        data = {'reporter_id': 9999}
        response = self.client.post(url, data, format='json')
        logger.info(f"Invalid reporter response: {response.status_code}")
        self.assertEqual(response.status_code, 400)

        # Ensure the target survivor's reports_count hasn't changed
        self.target_survivor.refresh_from_db()
        self.assertEqual(self.target_survivor.reports_count, 0)
        self.assertFalse(self.target_survivor.is_infected)
        logger.info(
            f"Survivor '{self.target_survivor.name}'"
            f"still has {self.target_survivor.reports_count} reports and is not infected."
        )