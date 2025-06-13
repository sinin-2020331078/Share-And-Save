from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from products.models import FoodItem
from .models import Notification
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@receiver(post_save, sender=FoodItem)
def create_food_notification(sender, instance, created, **kwargs):
    logger.info("Signal triggered for FoodItem")
    logger.info(f"Created: {created}")
    logger.info(f"Instance: {instance}")
    logger.info(f"Instance user: {instance.user}")
    
    if created:
        logger.info(f"Creating notifications for new food item: {instance.title}")
        # Create notifications for all users except the creator
        users = User.objects.exclude(id=instance.user.id)
        logger.info(f"Found {users.count()} users to notify")
        
        notifications = [
            Notification(
                user=user,
                type='food',
                message=f'New food item added: {instance.title}',
                related_item_id=instance.id
            )
            for user in users
        ]
        
        try:
            created_notifications = Notification.objects.bulk_create(notifications)
            logger.info(f"Successfully created {len(created_notifications)} notifications")
        except Exception as e:
            logger.error(f"Error creating notifications: {str(e)}")
            raise

@receiver(post_delete, sender=FoodItem)
def delete_food_notifications(sender, instance, **kwargs):
    logger.info(f"Deleting notifications for food item: {instance.id}")
    try:
        # Delete all notifications related to this food item
        deleted_count = Notification.objects.filter(
            type='food',
            related_item_id=instance.id
        ).delete()
        logger.info(f"Successfully deleted {deleted_count[0]} notifications")
    except Exception as e:
        logger.error(f"Error deleting notifications: {str(e)}")
        raise 