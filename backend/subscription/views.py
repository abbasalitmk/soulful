from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import razorpay
import json
from .models import Membership, Payment
from datetime import datetime, timedelta


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        amount = 10000
        currency = "INR"
        client = razorpay.Client(
            auth=(settings.RAZORPAY_API_KEY, settings.RAZORPAY_API_SECRET))

        try:
            payment_order = client.order.create(
                {"amount": amount, "currency": currency})
            return Response({"order_id": payment_order["id"]}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        payment_id = request.data.get('payment_id')
        razorpay_signature = request.data.get('razorpay_signature')
        amount = request.data.get('amount')

        client = razorpay.Client(
            auth=(settings.RAZORPAY_API_KEY, settings.RAZORPAY_API_SECRET))

        try:
            payload = {
                'order_id': order_id,
                'payment_id': payment_id
            }
            # Convert the payload to a JSON string
            payload_json = json.dumps(payload, separators=(',', ':'))

            client.utility.verify_payment_signature({
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': razorpay_signature
            })

            payment = Payment.objects.create(
                user=request.user, order_id=order_id, payment_status=True, amount=amount)
            current_date = datetime.now().date()
            expiration_date = current_date+timedelta(days=30)

            membership = Membership.objects.create(
                user=request.user, expiration_date=expiration_date)

            return Response({"message": "Payment successful"}, status=status.HTTP_200_OK)
        except razorpay.errors.SignatureVerificationError:
            return Response({"message": "Signature verification failed"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Handle other exceptions as needed
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CheckPrimeMember(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        try:
            is_prime = Membership.objects.filter(
                user=user, is_active=True).exists()
            return Response({"is_active": is_prime
                             }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
