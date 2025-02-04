package com.example.btldoan.controllers;

import com.example.btldoan.domain.PaymentMethod;
import com.example.btldoan.models.Address;
import com.example.btldoan.response.PaymentResponse;
import com.example.btldoan.services.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.LinkedHashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;
    @Value("${payment.vnPay.secretKey}")
    private String SECRET_KEY;

    @PostMapping("/vn-pay")
    public ResponseEntity<PaymentResponse<?>> pay(HttpServletRequest request, @RequestBody Address shippingAddress,
                                                  @RequestHeader("Authorization") String jwt) {
        return new ResponseEntity<>(paymentService.createVnPayPayment(request, shippingAddress, jwt), HttpStatus.OK);
    }

    @GetMapping("/vn-pay-callback")
    public ResponseEntity<PaymentResponse<?>> payCallbackHandler(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        if (status.equals("00")) {
            return new ResponseEntity<>(new PaymentResponse<>("00", "Success", "",null,null),HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new PaymentResponse<>("300", "Fail", "",null,null),HttpStatus.BAD_REQUEST);
        }
    }
}
