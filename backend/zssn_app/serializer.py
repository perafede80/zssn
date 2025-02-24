from rest_framework import serializers
from .models import Survivor, Item, Inventory

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'points']

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ['item', 'quantity']

class SurvivorSerializer(serializers.ModelSerializer):
    inventory = InventorySerializer(many=True)  # Nested serializer for inventory

    class Meta:
        model = Survivor
        fields = ['id', 'name', 'age', 'gender', 'latitude', 'longitude', 'is_infected', 'reports_count', 'inventory']
        depth = 2

    def validate_inventory(self, value):
        """Ensure at least one inventory item exists."""
        if not value or len(value) == 0:
            raise serializers.ValidationError("Survivor must have at least one inventory item.")
        return value

    def create(self, validated_data):
        inventory_data = validated_data.pop("inventory")
        survivor = Survivor.objects.create(**validated_data)

        Inventory.objects.bulk_create(
            [Inventory(survivor=survivor, **item) for item in inventory_data]
        )

        return survivor

    def update(self, instance, validated_data):
        """
        Update a Survivor's details, but do not allow direct updates to the inventory.
        """
        # Ensure the 'inventory' field is not updated directly
        validated_data.pop('inventory', None)

        # Update the Survivor instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance