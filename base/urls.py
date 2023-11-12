from django.contrib import admin
from django.urls import include, path
from . import views

urlpatterns = [
    # Product URLs
    path('products/', views.product_list, name='product-list'),
    path('products/<int:pk>/', views.product_detail, name='product-detail'),

    # Category URLs
    path('categories/', views.category_list, name='category-list'),
    path('categories/<int:pk>/', views.category_detail, name='category-detail'),

    # Order URLs
    path('orders/', views.order_list, name='order-list'),
    path('orders/<int:pk>/', views.order_detail, name='order-detail'),

    # OrderDetail URLs
    path('orderdetails/', views.order_detail_list, name='orderdetail-list'),
    path('orderdetails/<int:pk>/', views.order_detail_detail, name='orderdetail-detail'),
]
