package com.example.btldoan.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class AddItemRequest {

    private Long productId;
    private String size;
    private int quantity;
    private Integer price;

    public AddItemRequest() {

    }
}
