package com.example.btldoan.repositories;

import com.example.btldoan.models.OrderItem;
import com.example.btldoan.request.RevenueByCategoryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("SELECT new com.example.btldoan.request.RevenueByCategoryDTO( " +
            "c.name, SUM(oi.discountedPrice * oi.quantity)) " +
            "FROM OrderItem oi " +
            "JOIN oi.product p " +
            "JOIN p.category c " +
            "GROUP BY c.name")
    List<RevenueByCategoryDTO> findRevenueByCategory();
}
