from rest_framework import serializers

from .constants import GENDER_CHOICES
from .models import Inventory, Survivor


class InventorySerializer(serializers.ModelSerializer):
    """
    Serializer for the Inventory model.
    Used as a nested serializer within the SurvivorSerializer.
    """
    class Meta:
        model = Inventory
        fields = ['item', 'quantity']
        read_only_fields = ['item', 'quantity']  # Prevent direct updates to inventory

class SurvivorSerializer(serializers.ModelSerializer):
    """
    Serializer for the Survivor model
    """
    inventory = InventorySerializer(many=True)

    @staticmethod
    def validate_gender(value):
        valid_genders = [choice[0] for choice in GENDER_CHOICES]
        if value not in valid_genders:
            raise serializers.ValidationError(f"Invalid gender. Must be one of {valid_genders}.")
        return value

    @staticmethod
    def validate_latitude(value):
        if not (-90 <= value <= 90):
            raise serializers.ValidationError("Latitude must be between -90 and 90.")
        return value

    @staticmethod
    def validate_longitude(value):
        if not (-180 <= value <= 180):
            raise serializers.ValidationError("Longitude must be between -180 and 180.")
        return value

    @staticmethod
    def validate_inventory(value):
        if not value or len(value) == 0:
            raise serializers.ValidationError("Survivor must have at least one inventory item.")
        return value

    def create(self, validated_data):
        """
        Create a new survivor with an initial inventory.
        """
        inventory_data = validated_data.pop("inventory")
        survivor = Survivor.objects.create(**validated_data)
        Inventory.objects.bulk_create(
            [Inventory(survivor=survivor, **item) for item in inventory_data]
        )
        return survivor

    def update(self, instance, validated_data):
        validated_data.pop('inventory', None)
        """
        Update a Survivor's details, but do not allow direct updates to the inventory.
        """
        # Ensure the 'inventory' field is not updated directly
        validated_data.pop("inventory", None)

        # Update the Survivor instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

    class Meta:
        model = Survivor
        fields = [
            'id', 'name', 'age', 'gender', 'latitude', 'longitude',
            'is_infected', 'reports_count', 'inventory'
        ]