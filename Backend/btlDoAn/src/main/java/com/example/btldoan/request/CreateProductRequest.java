package com.example.btldoan.request;

import com.example.btldoan.models.Size;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
@Data
@Setter
@Getter
public class CreateProductRequest {
    private String title;

    private String description;

    private int price;

//    private int discountedPrice;

    private int discountPersent;

    private int quantity;

    private String brand;

    private String color;

    private Set<Size> size=new HashSet<>();

    private String imageUrl;

    private String topLevelCategory;

    private String secondLevelCategory;

    private String thirdLevelCategory;
    public int getDiscountedPrice() {
        return price - (price * discountPersent / 100);
    }
}
