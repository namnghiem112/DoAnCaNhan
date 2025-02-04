package com.example.btldoan.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Entity
@Getter
@Setter
@Data
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    private Cart cart;

    @ManyToOne
    private Product product;

    private String size;

    private int quantity;

    private Integer price;

    private Integer discountedPrice;

    private Long userId;

    public CartItem() {

    }

    public CartItem(Long id, Cart cart, Product product, String size, int quantity, Integer price, Long userId) {
        super();
        this.id = id;
        this.cart = cart;
        this.product = product;
        this.size = size;
        this.quantity = quantity;
        this.price = price;
        this.userId = userId;
    }


    @Override
    public int hashCode() {
        return Objects.hash(id);  // Sử dụng id duy nhất cho hashCode
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null) return false;
        if (getClass() != obj.getClass()) return false;
        CartItem other = (CartItem) obj;
        return Objects.equals(id, other.id);  // Chỉ so sánh id, không so sánh price, product, size
    }
}
