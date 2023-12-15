package com.pradeep.MajorProjectBackend.service;


import com.pradeep.MajorProjectBackend.dto.PaymentInfo;
import com.pradeep.MajorProjectBackend.dto.Purchase;
import com.pradeep.MajorProjectBackend.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
