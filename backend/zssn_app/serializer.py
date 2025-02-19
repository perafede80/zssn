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
        fields = ['id', 'name', 'age', 'gender', 'latitude', 'longitude', 'is_infected', 'inventory']
        depth = 2

    def create(self, validated_data):
        """
        Create a new Survivor and their associated Inventory.
        """
        inventory_data = validated_data.pop('inventory', None)

        if not inventory_data:
            raise serializers.ValidationError("Initial inventory must be declared.")

        survivor = Survivor.objects.create(**validated_data)
        Inventory.objects.create(survivor=survivor, **inventory_data)
        return survivor

    def update(self, instance, validated_data):
        """
        Update a Survivor's details, but do not allow direct updates to the inventory.
        """
        # Ensure the 'inventory' field is not updated directly
        validated_data.pop('inventory', None)  # Remove 'inventory' from validated_data

        # Update the Survivor instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance