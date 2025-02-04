package com.example.btldoan.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class LoginResponse {
    private String jwtToken;
    private String email;
    private String role;

    public LoginResponse(String email, String role, String jwtToken) {
        this.email = email;
        this.role = role;
        this.jwtToken = jwtToken;
    }

}
