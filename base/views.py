from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Product, Category, Order, OrderDetail
from .Serializers import ProductSerializer, CategorySerializer, OrderSerializer, OrderDetailSerializer
from django.contrib.auth import login
from django.http import JsonResponse
from .forms import RegistrationForm
from django.core.mail import EmailMessage
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.models import User
import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


@api_view(['POST'])
def submit_order2(request):
    if request.method == 'POST':
        serializer = OrderSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'Order submitted successfully'}, status=status.HTTP_201_CREATED)
        else:
            errors = {
                'order_errors': serializer.errors
            }
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'detail': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


def format_errors(errors):
    formatted_errors = {}
    for field, field_errors in errors.items():
        formatted_errors[field] = [str(error) for error in field_errors]
    return formatted_errors

@api_view(['POST'])
def register_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        form = RegistrationForm(data)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return Response({'success': True}, status=status.HTTP_201_CREATED)
        else:
            formatted_errors = format_errors(form.errors)
            return Response({'success': False, 'errors': formatted_errors}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'detail': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


# Views for Product
@api_view(['GET', 'POST'])
def product_list(request):
    if request.method == 'GET':
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Views for Category
@api_view(['GET', 'POST'])
def category_list(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def category_detail(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CategorySerializer(category)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Views for Order
@api_view(['GET', 'POST'])
def order_list(request):
    if request.method == 'GET':
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def order_detail(request, pk):
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = OrderSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Views for OrderDetail
@api_view(['GET', 'POST'])
def order_detail_list(request):
    if request.method == 'GET':
        order_details = OrderDetail.objects.all()
        serializer = OrderDetailSerializer(order_details, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = OrderDetailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def order_detail_detail(request, pk):
    try:
        order_detail = OrderDetail.objects.get(pk=pk)
    except OrderDetail.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = OrderDetailSerializer(order_detail)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = OrderDetailSerializer(order_detail, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        order_detail.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    



@csrf_exempt
@require_POST
def contact(request):
    data = json.loads(request.body)
    name = data.get('name', '')
    email = data.get('email', '')
    message = data.get('message', '')

    # Replace 'your_email@gmail.com' with your actual Gmail address
    to_email = 'shalevworkhightech@gmail.com'
    subject = 'New Contact Form Submission'
    body = f'Name: {name}\nEmail: {email}\nMessage:\n{message}'

    try:
        email_message = EmailMessage(subject, body, to=[to_email])
        email_message.send()

        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

class LoginView(TokenObtainPairView):
    # You can customize the behavior if needed
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # You can add additional logic or data to the response if needed
        return response
    
# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class LoginView(TokenObtainPairView):
    # You can customize the behavior if needed
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        # Include the username and user ID in the response
        user = self.user
        username = user.username if user.is_authenticated else None
        user_id = user.id if user.is_authenticated else None

        data = {
            'access': response.data['access'],
            'refresh': response.data['refresh'],
            'username': username,
            'user_id': user_id,
        }

        return Response(data, status=status.HTTP_200_OK)


# class CurrentUserView(APIView):
#     def get(self, request):
#         # Retrieve the currently logged-in user's username
#         username = request.user.username if request.user.is_authenticated else None
#         return Response({'username': username}, status=status.HTTP_200_OK)
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_data = {
            'username': request.user.username,
            'email': request.user.email,
            # Add any other user-related data you want to include
        }
        return Response(user_data, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def get_user_id_by_username(request, username):
    try:
        user = User.objects.get(username=username)
        user_id = user.id
        return Response({'user_id': user_id}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)