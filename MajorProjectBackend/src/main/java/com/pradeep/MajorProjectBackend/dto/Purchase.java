package com.pradeep.MajorProjectBackend.dto;

import com.pradeep.MajorProjectBackend.entity.Address;
import com.pradeep.MajorProjectBackend.entity.Customer;
import com.pradeep.MajorProjectBackend.entity.Order;
import com.pradeep.MajorProjectBackend.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
