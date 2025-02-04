package com.example.btldoan.services;

import com.example.btldoan.request.NewPasswordRequest;
import com.example.btldoan.exception.UserException;
import com.example.btldoan.models.Role;
import com.example.btldoan.models.User;
import com.example.btldoan.request.UserRoleRequest;
import com.example.btldoan.response.UserInfoResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User updateUser(Long userId, UserInfoResponse user) throws UserException;

    Page<User> getAllUsers(int page, int size);
    void deleteUser(Long userId);

    List<Role> getAllRoles();

    void updatePassword(Long userId, String password);

    boolean resetPassword(NewPasswordRequest newPassword);
    boolean isKeyExpired(String verifyKey);

    Optional<User> findByEmail(String email);

    User registerUser(User user);

    User getUserById(Long id);

    String forgotPassword(String email);

    User findUserProfileByJwt(String jwt) throws UserException;

    User findUserById(Long userId) throws UserException;

    User updateRoleUser(Long id, UserRoleRequest user) throws UserException;
}
