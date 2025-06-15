from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=100, blank=True, null=True)
    
    # Reputation fields
    reputation_points = models.IntegerField(default=0)
    total_items_shared = models.IntegerField(default=0)
    total_items_received = models.IntegerField(default=0)
    successful_transactions = models.IntegerField(default=0)
    
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    
    def get_reputation_level(self):
        """Calculate user reputation level based on points"""
        if self.reputation_points >= 1000:
            return "Community Champion"
        elif self.reputation_points >= 500:
            return "Trusted Member"
        elif self.reputation_points >= 200:
            return "Active Contributor"
        elif self.reputation_points >= 50:
            return "Community Member"
        else:
            return "New Member"
    
    def get_reputation_badges(self):
        """Get list of badges earned by user"""
        badges = []
        
        # Sharing badges
        if self.total_items_shared >= 50:
            badges.append("Super Sharer")
        elif self.total_items_shared >= 20:
            badges.append("Generous Giver")
        elif self.total_items_shared >= 5:
            badges.append("Community Helper")
        
        # Transaction badges
        if self.successful_transactions >= 100:
            badges.append("Transaction Master")
        elif self.successful_transactions >= 50:
            badges.append("Reliable Trader")
        elif self.successful_transactions >= 10:
            badges.append("Trusted Exchanger")
        
        # Reputation badges
        if self.reputation_points >= 1000:
            badges.append("Reputation Star")
        elif self.reputation_points >= 500:
            badges.append("Community Leader")
        
        return badges

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email}'s profile"

class ReputationHistory(models.Model):
    ACTION_CHOICES = [
        ('item_shared', 'Item Shared'),
        ('item_received', 'Item Received'),
        ('transaction_completed', 'Transaction Completed'),
        ('positive_feedback', 'Positive Feedback'),
        ('negative_feedback', 'Negative Feedback'),
        ('profile_completed', 'Profile Completed'),
        ('first_listing', 'First Listing'),
        ('community_interaction', 'Community Interaction'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reputation_history')
    action = models.CharField(max_length=30, choices=ACTION_CHOICES)
    points_earned = models.IntegerField()
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    related_item_id = models.IntegerField(null=True, blank=True)
    related_item_type = models.CharField(max_length=20, null=True, blank=True)  # 'food', 'free', 'discount'
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.action} (+{self.points_earned})"