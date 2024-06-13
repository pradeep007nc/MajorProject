package com.pradeep.MajorProjectBackend.controller;

import com.pradeep.MajorProjectBackend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/get-categories")
    public Map<String, Long> getCustomerCategoryAnalytics(@RequestParam String customerMail){
        return analyticsService.getProductCategoryForCustomer(customerMail);
    }
}
