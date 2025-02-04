package com.example.btldoan.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewPasswordRequest {
    private String password;
    private String verifyKey;
}