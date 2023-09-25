from django.urls import path
from .views import CreateOrderView, VerifyPaymentView, CheckPrimeMember

urlpatterns = [

    path('order/', CreateOrderView.as_view(), name='order'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify_payment'),
    path('is-prime/', CheckPrimeMember.as_view(), name="is_prime")

]
