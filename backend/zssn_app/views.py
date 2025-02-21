from django.http import JsonResponse
from rest_framework import viewsets, status
from .models import Survivor, Inventory, Item
from zssn_app.serializer import SurvivorSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.core.exceptions import ValidationError as DjangoValidationError

def health_check(request):
    return JsonResponse({"status": "ok"}, status=200)


class SurvivorViewSet(viewsets.ModelViewSet):
    queryset = Survivor.objects.filter(is_infected=False)  # Exclude infected survivors
    serializer_class = SurvivorSerializer

    def perform_create(self, serializer):
        """Ensure inventory is provided when creating a survivor."""
        if not self.request.data.get('inventory'):
            raise ValidationError("Initial inventory must be declared.")
        serializer.save()

    @action(detail=True, methods=['put'])
    def update_location(self, request, pk=None):
        """Update the survivor's location."""
        survivor = self.get_object()

        # Extract latitude and longitude from the request data
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')

        if latitude is None or longitude is None:
            return Response({"error": "Both latitude and longitude are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except ValueError:
            return Response({"error": "Latitude and longitude must be numeric values."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Update the survivor's location
        survivor.latitude = latitude
        survivor.longitude = longitude

        try:
            survivor.full_clean()
        except DjangoValidationError as e:
            return Response({"error": e.message_dict}, status=status.HTTP_400_BAD_REQUEST)

        survivor.save()
        serializer = self.get_serializer(survivor)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def report_infection(self, request, pk=None):
        """Report a survivor as potentially infected."""
        survivor = self.get_object()  # Get the survivor being reported
        reporter_id = request.data.get('reporter_id')

        if not reporter_id:
            raise ValidationError("Reporter ID is required.")

        try:
            reporter = Survivor.objects.get(id=reporter_id, is_infected=False)
        except Survivor.DoesNotExist:
            raise ValidationError("Invalid reporter ID or reporter is infected.")

        if survivor == reporter:
            raise ValidationError("A survivor cannot report themselves.")

        # Increment the reports count
        survivor.reports_count += 1

        # If the reports count reaches 3, mark the survivor as infected
        if survivor.reports_count >= 3:
            survivor.is_infected = True

        survivor.save()

        serializer = self.get_serializer(survivor)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def trade(self, request, pk=None):
        """Allow survivors to trade items."""
        survivor_a = self.get_object()

        survivor_b_id = request.data.get('survivor_b_id')
        items_a = request.data.get('items_a', {})
        items_b = request.data.get('items_b', {})

        if survivor_a.is_infected:
            return Response({"error": "Infected survivors cannot trade."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            survivor_b = Survivor.objects.get(id=survivor_b_id, is_infected=False)
        except Survivor.DoesNotExist:
            return Response({"error": "Invalid survivor B ID or survivor B is infected."}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate points for both sides
        points_a = sum(items_a.get(item, 0) * price for item, price in {
            'WATER': 4, 'FOOD': 3, 'MEDICATION': 2, 'AMMUNITION': 1
        }.items())

        points_b = sum(items_b.get(item, 0) * price for item, price in {
            'WATER': 4, 'FOOD': 3, 'MEDICATION': 2, 'AMMUNITION': 1
        }.items())

        if points_a != points_b:
            return Response({"error": "The trade is not balanced."},
                            status=status.HTTP_400_BAD_REQUEST)

        print("perform the trade")
        # Perform the trade
        for item, amount in items_a.items():
            normalized_item = item.upper()  # Ensure case matches database values
            inventory_entry_a = Inventory.objects.get(survivor=survivor_a, item=normalized_item)
            inventory_entry_a.quantity -= amount
            inventory_entry_a.save()

            inventory_entry_b = Inventory.objects.get(survivor=survivor_b, item=normalized_item)
            inventory_entry_b.quantity += amount
            inventory_entry_b.save()

        for item, amount in items_b.items():
            normalized_item = item.upper()
            inventory_entry_b = Inventory.objects.get(survivor=survivor_b, item=normalized_item)
            inventory_entry_b.quantity -= amount
            inventory_entry_b.save()

            inventory_entry_a = Inventory.objects.get(survivor=survivor_a, item=normalized_item)
            inventory_entry_a.quantity += amount
            inventory_entry_a.save()

        return Response({"message": "Trade successful."}, status=status.HTTP_200_OK)