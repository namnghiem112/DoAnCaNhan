package com.example.btldoan.services;

import com.example.btldoan.models.Address;
import com.example.btldoan.response.PaymentResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
    PaymentResponse<?> createVnPayPayment(HttpServletRequest request, Address shippingAddress, String jwt);
}
