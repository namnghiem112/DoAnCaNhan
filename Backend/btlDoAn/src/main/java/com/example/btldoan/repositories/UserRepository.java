package com.example.btldoan.repositories;

import com.example.btldoan.models.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.verifyKey = :verifyKey, u.keyCreated = :tokenCreated, u.keyExpired = :tokenExpired WHERE u.email = :email")
    void updateTokenDetailsByEmail(String email, String verifyKey, Date tokenCreated, Date tokenExpired);

    @Query("SELECT u.keyExpired FROM User u WHERE u.verifyKey = :verifyKey")
    Date getTokenExpiredDate(String verifyKey);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.password = :password, u.keyExpired = :expired WHERE u.verifyKey = :verifyKey")
    void updatePassword(String password, String verifyKey, Date expired);

    @Query("SELECT COUNT(*) FROM User u WHERE u.verifyKey = :verifyKey")
    int getUserByToken(String verifyKey);
}

