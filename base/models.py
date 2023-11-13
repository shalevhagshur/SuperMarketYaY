from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    productID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    price = models.FloatField(max_length=1000)
    description = models.TextField()
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True)
    prodimage = models.ImageField(upload_to='product_images/', null=True, blank=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    categoryID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='category_images/', null=True, blank=True)

    def __str__(self):
        return self.name

class Order(models.Model):
    orderID = models.AutoField(primary_key=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)

class OrderDetail(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
