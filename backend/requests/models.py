from django.db import models
from django.conf import settings

class Request(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Fulfilled', 'Fulfilled'),
    ]

    CATEGORY_CHOICES = [
        ('Furniture', 'Furniture'),
        ('Clothing', 'Clothing'),
        ('Books', 'Books'),
        ('Other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='requests')
    location = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
