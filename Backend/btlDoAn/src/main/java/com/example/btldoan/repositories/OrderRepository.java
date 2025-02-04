package com.example.btldoan.repositories;


import com.example.btldoan.domain.OrderStatus;
import com.example.btldoan.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.orderStatus IN ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED','CANCELLED')")
    List<Order> getUsersOrders(@Param("userId") Long userId);

    List<Order> findAllByOrderByCreatedAtDesc();
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.orderDate BETWEEN :start AND :end")
    Double getRevenueByDateRange(LocalDateTime start, LocalDateTime end);

    @Query("SELECT DAY(o.orderDate), SUM(o.totalPrice) FROM Order o WHERE o.orderDate BETWEEN :start AND :end GROUP BY DAY(o.orderDate)")
    List<Object[]> getDailyRevenue(LocalDateTime start, LocalDateTime end);

    @Query("SELECT MONTH(o.orderDate), SUM(o.totalPrice) FROM Order o WHERE o.orderDate BETWEEN :start AND :end GROUP BY MONTH(o.orderDate)")
    List<Object[]> getMonthlyRevenue(LocalDateTime start, LocalDateTime end);

    @Query("SELECT YEAR(o.orderDate), SUM(o.totalPrice) FROM Order o GROUP BY YEAR(o.orderDate)")
    List<Object[]> getYearlyRevenue();
}
