package com.example.btldoan.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@Builder
public class PaymentResponse<T> {
    private String status;
    private String message;
    private String jwt;
    private T addressData;
    private T responseData;
}