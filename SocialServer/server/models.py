# models.py

from django.db import models
from django.utils.timezone import now

class UserLog(models.Model):
    username = models.CharField(max_length=255, unique=True)
    last_request_time = models.DateTimeField(default=now)
    error_details = models.TextField(null=True, blank=True)
    last_successful_update = models.DateTimeField(null=True, blank=True)  # Track the last success
    last_error_time = models.DateTimeField(null=True, blank=True)  # Track when the error occurred

    def __str__(self):
        return f"UserLog for {self.username}"
