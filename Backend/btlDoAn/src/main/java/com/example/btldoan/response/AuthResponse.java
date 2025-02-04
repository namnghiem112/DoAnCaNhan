package com.example.btldoan.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {

    private String jwt;

    private boolean status;

    public AuthResponse() {
    }

    public AuthResponse(String jwt, boolean status) {
        super();
        this.jwt = jwt;
        this.status = status;
    }
}
