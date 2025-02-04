package com.example.btldoan.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoResponse {
    private String firstName;
    private String lastName;
    private String mobile;
    private String gender;
    private LocalDate birthDate;

}
