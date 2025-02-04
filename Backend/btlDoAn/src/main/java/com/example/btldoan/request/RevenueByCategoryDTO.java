package com.example.btldoan.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueByCategoryDTO {
    private String categoryName;
    private double totalRevenue;
}