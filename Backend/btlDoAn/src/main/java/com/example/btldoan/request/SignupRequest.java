package com.example.btldoan.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String firstName;
    @NotBlank
    @Size(min = 3, max = 20)
    private String lastName;
    @Nullable
    private String signUpMethod;
    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @Setter
    @Getter
    private String role;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
}