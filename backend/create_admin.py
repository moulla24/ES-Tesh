#!/usr/bin/env python3
"""
Script to create default admin user
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'esatez.settings')
django.setup()

from authentication.models import User

# Create admin user if doesn't exist
email = 'admin@esa-tez.com'
if not User.objects.filter(email=email).exists():
    admin = User.objects.create_superuser(
        email=email,
        username='admin',
        password='admin123',
        first_name='Admin',
        last_name='ESA-TEZ',
        role='ADMIN'
    )
    print(f'Admin user created: {email}')
    print('Password: admin123')
else:
    print(f'Admin user already exists: {email}')
