import logging
from django.http import JsonResponse
from rest_framework import viewsets, status
from .constants import REPORTS_TO_MARK_INFECTED
from .models import Survivor, Inventory, Item
from .serializer import SurvivorSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .services import SurvivorService, TradeService
from django.core.exceptions import ValidationError as DjangoValidationError

logger = logging.getLogger(__name__)

def health_check(request):
    return JsonResponse({"status": "ok"}, status=200)


class SurvivorViewSet(viewsets.ModelViewSet):
    queryset = Survivor.objects.filter(is_infected=False) 
    serializer_class = SurvivorSerializer
    survivor_service = SurvivorService()

    def perform_create(self, serializer):
        """Ensure inventory is provided when creating a survivor."""
        if not self.request.data.get('inventory'):
            logger.warning("Initial inventory must be declared.")
            raise ValidationError("Initial inventory must be declared.")
        serializer.save()
        logger.info("Survivor created successfully.")

    @action(detail=True, methods=['put'])
    def update_location(self, request, pk=None):
        """Update the survivor's last known location."""
        survivor = self.get_object()
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')

        if latitude is None or longitude is None:
            logger.warning("Both latitude and longitude are required.")
            return Response({"error": "Both latitude and longitude are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except ValueError:
            logger.warning("Latitude and longitude must be numeric values.")
            return Response({"error": "Latitude and longitude must be numeric values."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            updated_survivor = self.survivor_service.update_location(survivor, latitude, longitude)
        except DjangoValidationError as e:
            logger.error(f"Validation error when updating location: {e.message_dict}")
            return Response({"error": e.message_dict}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(updated_survivor)
        logger.info(f"Location updated for survivor {survivor.id}")
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def report_infection(self, request, pk=None):
        """Report a survivor as potentially infected."""
        survivor = self.get_object()
        reporter_id = request.data.get('reporter_id')

        if not reporter_id:
            logger.warning("Reporter ID is required.")
            raise ValidationError("Reporter ID is required.")

        try:
            updated_survivor = self.survivor_service.report_infection(survivor, reporter_id)
        except ValidationError as e:
            logger.error(f"Validation error when reporting infection: {e}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(updated_survivor)
        logger.info(f"Survivor {survivor.id} reported as infected by reporter {reporter_id}")
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def trade_items(self, request, pk=None):
        """Allow survivors to trade items."""
        survivor_a = self.get_object()

        survivor_b_id = request.data.get('survivor_b_id')
        items_to_trade_from_a = request.data.get('items_from_a', {})
        items_to_trade_from_b = request.data.get('items_from_b', {})

        try:
            survivor_b = Survivor.objects.get(id=survivor_b_id)
        except Survivor.DoesNotExist:
            logger.warning(f"Invalid survivor B ID: {survivor_b_id}")
            return Response({"error": "Invalid survivor B ID."}, status=status.HTTP_400_BAD_REQUEST)

        trade_service = TradeService(survivor_a, survivor_b, items_to_trade_from_a, items_to_trade_from_b)

        if not trade_service.can_trade():
            logger.warning(f"Trade restriction encountered: {trade_service.get_trade_restriction()}")
            return Response({"error": trade_service.get_trade_restriction()}, status=status.HTTP_400_BAD_REQUEST)

        try:
            trade_service.execute_trade()
        except ValidationError as e:
            logger.error(f"Trade execution error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        logger.info(f"Trade successful between survivor {survivor_a.id} and survivor {survivor_b_id}")
        return Response({"message": "Trade successful."}, status=status.HTTP_200_OK)