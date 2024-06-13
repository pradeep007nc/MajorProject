package com.pradeep.MajorProjectBackend.service;

import com.pradeep.MajorProjectBackend.dao.OrderRepository;
import com.pradeep.MajorProjectBackend.dao.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public Map<String, Long> getProductCategoryForCustomer(String customerMail){
        List<Long> productIds = orderRepository.findAllProductIdForCustomer(customerMail);
        List<Object[]> productCategory = productRepository.getProductCategory(productIds);
        return productCategory.stream().collect(java.util.stream.Collectors.toMap(obj -> (String)obj[0], obj -> (Long)obj[1]));
    }

}
