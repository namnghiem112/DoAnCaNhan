package com.example.btldoan.models;

import com.example.btldoan.domain.OrderStatus;
import com.example.btldoan.domain.PaymentMethod;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    private LocalDateTime orderDate;

    private LocalDateTime deliveryDate;

    @OneToOne
    private Address shippingAddress;

    private double totalPrice;

    private Integer totalDiscountedPrice;

    private Integer discounte;
    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    private int totalItem;

    private LocalDateTime createdAt;
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
}
