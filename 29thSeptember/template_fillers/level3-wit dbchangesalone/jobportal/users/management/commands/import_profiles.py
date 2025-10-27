from django.core.management.base import BaseCommand
import csv
from users.models import User, Profile

class Command(BaseCommand):
    help = 'Import profiles in bulk from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']
        with open(csv_file, newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                email = row['email']
                username = row['username']

                user, created = User.objects.get_or_create(
                    email=email,
                    defaults={'username': username}
                )

                Profile.objects.update_or_create(
                    user=user,
                    defaults={
                        'skills': row['skills'],
                        'education': row['education'],
                        'experience': row['experience'],
                        'location': row['location'],
                        'full_name': row['full_name'],
                        'preferred_mode': row['preferred_mode']
                    }
                )

        self.stdout.write(self.style.SUCCESS('✅ Bulk profiles imported successfully!'))