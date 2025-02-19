#!/bin/bash

python3 manage.py migrate

# Use Django's development server
python3 manage.py runserver 0.0.0.0:8000