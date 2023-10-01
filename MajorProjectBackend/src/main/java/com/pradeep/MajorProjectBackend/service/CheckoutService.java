package com.pradeep.MajorProjectBackend.service;


import com.pradeep.MajorProjectBackend.dto.Purchase;
import com.pradeep.MajorProjectBackend.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
