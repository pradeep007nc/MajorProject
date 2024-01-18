package com.pradeep.MajorProjectBackend.service;

import com.pradeep.MajorProjectBackend.dao.CustomerRepository;
import com.pradeep.MajorProjectBackend.dto.PaymentInfo;
import com.pradeep.MajorProjectBackend.dto.Purchase;
import com.pradeep.MajorProjectBackend.dto.PurchaseResponse;
import com.pradeep.MajorProjectBackend.entity.Customer;
import com.pradeep.MajorProjectBackend.entity.Order;
import com.pradeep.MajorProjectBackend.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

    private KafkaProducerService kafkaProducerService;

    @Autowired
    private EmailService emailService;


    public CheckoutServiceImpl(CustomerRepository customerRepository, @Value("${stripe.key.secret}") String secretKey, KafkaProducerService kafkaProducerService) {
        this.customerRepository = customerRepository;
        this.kafkaProducerService = kafkaProducerService;

        //init stripe api with secret key
        Stripe.apiKey = secretKey;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        // retrieve the order info from dto
        Order order = purchase.getOrder();

        // generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        // populate order with billingAddress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        // populate customer with order
        Customer customer = purchase.getCustomer();

        // check if this is an existing customer
        String theEmail = customer.getEmail();

        Customer customerFromDB = customerRepository.findByEmail(theEmail);

        if (customerFromDB != null) {
            // we found them ... let's assign them accordingly
            customer = customerFromDB;
        }

        customer.add(order);

        // save to the database
        customerRepository.save(customer);

        String message = mailMessageGenerator(customer, orderItems);

        kafkaProducerService.sendMessage(message);

        emailService.sendMail(customer.getEmail(), message);

        // return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String mailMessageGenerator(Customer customer, Set<OrderItem> orderItems) {
        StringBuilder message = new StringBuilder("Hi " + customer.getFirstName() + "\nThanks for being our valuable customer." +
                "\nHere are your below order details");

        orderItems.forEach(data -> {
            message.append("\nDetails ---------");
            message.append("\nTracking Id: "+ data.getOrder().getOrderTrackingNumber());
            message.append("\nBilling State: "+ data.getOrder().getBillingAddress().getState());
            message.append("\nShipping City: "+ data.getOrder().getShippingAddress().getCity());
            message.append("\nPrice: "+ data.getOrder().getTotalPrice());
            Date date = new Date();
            message.append("\nPurchase date: "+ date.getYear()+":"+ date.getMonth()+":"+date.getDay());

//            message.append("\nOrderDetails ---------\n");
//            data.getOrder().getOrderItems().forEach(data2 -> {
//                message.append("\nOrder Id: "+ data2.getId());
//                message.append("\nOrder Quantity: "+ data2.getQuantity());
//            });
        });

        return message.toString();
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        List<String> paymentMethods = new ArrayList<>();
        paymentMethods.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethods);

        return PaymentIntent.create(params);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}









