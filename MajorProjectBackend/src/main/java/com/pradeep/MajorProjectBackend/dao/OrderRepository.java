package com.pradeep.MajorProjectBackend.dao;

import com.pradeep.MajorProjectBackend.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource
public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByCustomerEmailOrderByDateCreatedDesc(@Param("email") String email, Pageable pageable);

    @Query("select oi.productId from Order o join o.orderItems oi where o.customer.email = :customerMail")
    List<Long> findAllProductIdForCustomer(String customerMail);

}
