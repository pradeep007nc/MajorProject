package com.pradeep.MajorProjectBackend.controller;


import com.pradeep.MajorProjectBackend.dto.Purchase;
import com.pradeep.MajorProjectBackend.dto.PurchaseResponse;
import com.pradeep.MajorProjectBackend.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {

        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);

        return purchaseResponse;
    }

}









