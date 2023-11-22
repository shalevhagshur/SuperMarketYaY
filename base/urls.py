from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
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

    path('contact/', views.contact, name='contact'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('register/', views.register_view),

    path('login/', views.LoginView.as_view(), name='login'),

    path('get_current_user/', views.CurrentUserView.as_view(), name='get_current_user'),
    path('submit_order/', views.submit_order2, name='submit-order'),
    path('api/get_user_id/<str:username>/', views.get_user_id_by_username)
]
