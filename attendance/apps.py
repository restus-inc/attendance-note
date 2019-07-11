from django.apps import AppConfig
import os
from attendancenote.settings import BASE_DIR


class Config(AppConfig):
    name = 'attendance'
    company = 'restus'
    path = os.path.join(BASE_DIR, 'attendance')
