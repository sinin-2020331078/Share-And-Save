from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import FoodItem, FreeProduct, DiscountProduct
from users.utils import award_reputation_points, get_reputation_points_for_action
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=FoodItem)
def handle_food_item_creation(sender, instance, created, **kwargs):
    if created:
        logger.info(f"Food item created: {instance.title} by {instance.user}")
        
        # Award points for sharing an item
        points = get_reputation_points_for_action('item_shared')
        award_reputation_points(
            user=instance.user,
            action='item_shared',
            points=points,
            description=f"Shared food item: {instance.title}",
            related_item_id=instance.id,
            related_item_type='food'
        )
        
        # Award bonus points for first listing
        if instance.user.total_items_shared == 1:  # This is their first item
            bonus_points = get_reputation_points_for_action('first_listing')
            award_reputation_points(
                user=instance.user,
                action='first_listing',
                points=bonus_points,
                description="First item shared on Share&Save!",
                related_item_id=instance.id,
                related_item_type='food'
            )

@receiver(post_save, sender=FreeProduct)
def handle_free_product_creation(sender, instance, created, **kwargs):
    if created:
        logger.info(f"Free product created: {instance.title} by {instance.user}")
        
        # Award points for sharing an item
        points = get_reputation_points_for_action('item_shared')
        award_reputation_points(
            user=instance.user,
            action='item_shared',
            points=points,
            description=f"Shared free product: {instance.title}",
            related_item_id=instance.id,
            related_item_type='free'
        )
        
        # Award bonus points for first listing
        if instance.user.total_items_shared == 1:  # This is their first item
            bonus_points = get_reputation_points_for_action('first_listing')
            award_reputation_points(
                user=instance.user,
                action='first_listing',
                points=bonus_points,
                description="First item shared on Share&Save!",
                related_item_id=instance.id,
                related_item_type='free'
            )

@receiver(post_save, sender=DiscountProduct)
def handle_discount_product_creation(sender, instance, created, **kwargs):
    if created:
        logger.info(f"Discount product created: {instance.title} by {instance.user}")
        
        # Award points for sharing an item
        points = get_reputation_points_for_action('item_shared')
        award_reputation_points(
            user=instance.user,
            action='item_shared',
            points=points,
            description=f"Shared discount product: {instance.title}",
            related_item_id=instance.id,
            related_item_type='discount'
        )
        
        # Award bonus points for first listing
        if instance.user.total_items_shared == 1:  # This is their first item
            bonus_points = get_reputation_points_for_action('first_listing')
            award_reputation_points(
                user=instance.user,
                action='first_listing',
                points=bonus_points,
                description="First item shared on Share&Save!",
                related_item_id=instance.id,
                related_item_type='discount'
            )