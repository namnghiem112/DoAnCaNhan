package com.example.btldoan.controllers;

import com.example.btldoan.response.AuthResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping()
public class HomeController {
    @GetMapping("")
    public ResponseEntity<AuthResponse> getHome(@RequestParam String token) {
        AuthResponse authResponse= new AuthResponse();
        authResponse.setStatus(true);
        authResponse.setJwt(token);
        if (token == null) {
            throw new NullPointerException("token is null");
        }
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }
}
