from django.db import transaction
from .models import ReputationHistory

def award_reputation_points(user, action, points, description, related_item_id=None, related_item_type=None):
    """
    Award reputation points to a user for a specific action
    """
    with transaction.atomic():
        # Create reputation history entry
        ReputationHistory.objects.create(
            user=user,
            action=action,
            points_earned=points,
            description=description,
            related_item_id=related_item_id,
            related_item_type=related_item_type
        )
        
        # Update user's total reputation points
        user.reputation_points += points
        
        # Update specific counters based on action
        if action == 'item_shared':
            user.total_items_shared += 1
        elif action == 'item_received':
            user.total_items_received += 1
        elif action == 'transaction_completed':
            user.successful_transactions += 1
        
        user.save()
        
        return user.reputation_points

def get_reputation_points_for_action(action):
    """
    Get the number of points awarded for each action
    """
    points_map = {
        'item_shared': 10,
        'item_received': 5,
        'transaction_completed': 15,
        'positive_feedback': 20,
        'negative_feedback': -10,
        'profile_completed': 10,
        'first_listing': 25,
        'community_interaction': 5,
    }
    return points_map.get(action, 0)

def calculate_user_trust_score(user):
    """
    Calculate a trust score based on user's reputation and activity
    """
    base_score = min(user.reputation_points / 10, 100)  # Max 100 from reputation
    
    # Bonus for successful transactions
    transaction_bonus = min(user.successful_transactions * 2, 50)  # Max 50 from transactions
    
    # Bonus for sharing items
    sharing_bonus = min(user.total_items_shared * 1, 25)  # Max 25 from sharing
    
    # Calculate final trust score (0-175 scale, normalized to 0-100)
    trust_score = (base_score + transaction_bonus + sharing_bonus) / 1.75
    
    return min(trust_score, 100)