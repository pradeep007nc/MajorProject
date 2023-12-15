package com.pradeep.MajorProjectBackend.dao;

import com.pradeep.MajorProjectBackend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByEmail(String theEmail);

}
