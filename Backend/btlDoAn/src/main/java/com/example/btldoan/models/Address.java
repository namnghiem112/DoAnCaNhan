package com.example.btldoan.models;

import com.example.btldoan.domain.PaymentMethod;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="first_name")
    private String firstName;

    @Column(name="last_name")
    private String lastName;

    @Column(name = "address")
    private String address;

    @ManyToOne
    @JoinColumn(name="user_id")
    @JsonIgnore
    private User user; // one user > many address

    private String mobile;
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
}
