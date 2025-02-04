package com.example.btldoan.services;



import com.example.btldoan.exception.CartItemException;
import com.example.btldoan.exception.OrderException;
import com.example.btldoan.exception.UserException;
import com.example.btldoan.models.Address;
import com.example.btldoan.models.Order;
import com.example.btldoan.models.User;
import com.example.btldoan.request.RevenueByCategoryDTO;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface OrderService {
    Order createOrder(User user, Address shippingAdress) throws CartItemException, UserException;

    Order findOrderById(Long orderId) throws OrderException;

    List<Order> usersOrderHistory(Long userId);


    Order confirmedOrder(Long orderId)throws OrderException;

    Order shippedOrder(Long orderId) throws OrderException;

    Order deliveredOrder(Long orderId) throws OrderException;

    Order cancledOrder(Long orderId) throws OrderException;

    Page<Order> getAllOrders(int page, int size);

    void deleteOrder(Long orderId) throws OrderException;
    Map<String, Double> getDailyRevenue(int month, int year);
    Map<String, Double> getMonthlyRevenue(int year);
    Map<String, Double> getYearlyRevenue();
    List<RevenueByCategoryDTO> getRevenueByCategory();
}
