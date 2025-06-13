from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator

User = get_user_model()

def food_image_path(instance, filename):
    # Generate a unique path for each food item image
    return f'food_images/{instance.user.id}/{filename}'

def free_product_image_path(instance, filename):
    # Generate a unique path for each free product image
    return f'free_products/{instance.user.id}/{filename}'

def discount_product_image_path(instance, filename):
    # Generate a unique path for each discount product image
    return f'discount_products/{instance.user.id}/{filename}'

class FoodItem(models.Model):
    CATEGORY_CHOICES = [
        ('vegetables', 'Vegetables'),
        ('fruits', 'Fruits'),
        ('dairy', 'Dairy'),
        ('meat', 'Meat & Seafood'),
        ('baked', 'Baked Goods'),
        ('canned', 'Canned Goods'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    price = models.IntegerField(null=True, blank=True)
    is_free = models.BooleanField(default=False)
    location = models.CharField(max_length=200)
    expiry_date = models.DateField()
    image = models.ImageField(
        upload_to=food_image_path,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif'])],
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='food_items')

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # If the item is free, set price to None
        if self.is_free:
            self.price = None
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']

class FreeProduct(models.Model):
    CATEGORY_CHOICES = [
        ('electronics', 'Electronics'),
        ('clothing', 'Clothing'),
        ('furniture', 'Furniture'),
        ('books', 'Books'),
        ('toys', 'Toys'),
        ('sports', 'Sports & Outdoors'),
        ('home', 'Home & Garden'),
        ('other', 'Other'),
    ]

    CONDITION_CHOICES = [
        ('new', 'New'),
        ('like_new', 'Like New'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('poor', 'Poor'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    location = models.CharField(max_length=200)
    image = models.ImageField(
        upload_to=free_product_image_path,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif'])],
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='free_products')
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class DiscountProduct(models.Model):
    CATEGORY_CHOICES = [
        ('electronics', 'Electronics'),
        ('clothing', 'Clothing'),
        ('furniture', 'Furniture'),
        ('books', 'Books'),
        ('toys', 'Toys'),
        ('sports', 'Sports & Outdoors'),
        ('home', 'Home & Garden'),
        ('other', 'Other'),
    ]

    CONDITION_CHOICES = [
        ('new', 'New'),
        ('like_new', 'Like New'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('poor', 'Poor'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    original_price = models.IntegerField()
    discount_price = models.IntegerField()
    location = models.CharField(max_length=200)
    image = models.ImageField(
        upload_to=discount_product_image_path,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif'])],
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='discount_products')
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Ensure discount price is less than original price
        if self.discount_price >= self.original_price:
            raise ValueError("Discount price must be less than original price")
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    item_type = models.CharField(max_length=20)  # 'food', 'free', 'discount'
    item_id = models.IntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.IntegerField()
    quantity = models.IntegerField(default=1)
    image_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'item_type', 'item_id')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email}'s cart - {self.title}" 