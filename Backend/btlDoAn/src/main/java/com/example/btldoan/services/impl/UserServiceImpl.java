package com.example.btldoan.services.impl;

import com.example.btldoan.config.jwt.JwtUtils;
import com.example.btldoan.domain.CommonConstant;
import com.example.btldoan.domain.UserRole;
import com.example.btldoan.request.NewPasswordRequest;
import com.example.btldoan.exception.UserException;
import com.example.btldoan.models.Role;
import com.example.btldoan.models.User;
import com.example.btldoan.repositories.RoleRepository;
import com.example.btldoan.repositories.UserRepository;
import com.example.btldoan.request.UserRoleRequest;
import com.example.btldoan.response.UserInfoResponse;
import com.example.btldoan.services.MailService;
import com.example.btldoan.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    private final MailService mailService;
    private final JwtUtils jwtUtils;

    @Override
    public User updateUser(Long id, UserInfoResponse updatedUser) throws UserException {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setMobile(updatedUser.getMobile());
            existingUser.setBirthDate(updatedUser.getBirthDate());
            existingUser.setGender(updatedUser.getGender());
            return userRepository.save(existingUser);
        } else {
            throw new UserException("User with ID " + id + " not found");
        }
    }

    @Override
    public Page<User> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable);
    }

    @Override
    public void deleteUser(Long id) {
        try {
            Optional<User> userOptional = userRepository.findById(id);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                userRepository.delete(user);
            } else {
                throw new RuntimeException("User not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public void updatePassword(Long userId, String password) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update password");
        }
    }

    @Override
    public boolean resetPassword(NewPasswordRequest newPasswordReq) {
        String verifyKey = newPasswordReq.getVerifyKey();
        if (verifyKey == null || verifyKey.isEmpty() || userRepository.getUserByToken(verifyKey) == 0 || isKeyExpired(verifyKey)) return false;
        String newPass = passwordEncoder.encode(newPasswordReq.getPassword());
        userRepository.updatePassword(newPass, newPasswordReq.getVerifyKey(), Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()));
        return true;
    }
    @Override
    public boolean isKeyExpired(String verifyKey) {
        Date expiredDate = userRepository.getTokenExpiredDate(verifyKey);
        return expiredDate.before(new Date());
    }
    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User registerUser(User user) {
        if (user.getPassword() != null)
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).get();
    }

    @Override
    public String forgotPassword(String email) {
        if (userRepository.findByEmail(email).isEmpty()) return CommonConstant.EMAIL_DONT_EXIST;
        String verifyKey = getVerifyKey();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dateTimePlus15Minutes = now.plusMinutes(15);
        Date datePlus15Minutes = Date.from(dateTimePlus15Minutes.atZone(ZoneId.systemDefault()).toInstant());
        userRepository.updateTokenDetailsByEmail(email, verifyKey, new Date(), datePlus15Minutes);
        mailService.sendMailUpdatePassword(verifyKey, email);
        return CommonConstant.SUCCESS;
    }

    @Override
    public User findUserProfileByJwt(String jwt) throws UserException {
        String email= jwtUtils.getEmailFromJwtToken(jwt);

        User user= userRepository.findByEmail(email).get();

        if(user==null) {
            throw new UserException("user not exist with email "+email);
        }
        return user;
    }

    @Override
    public User findUserById(Long userId) throws UserException {
        Optional<User> user=userRepository.findById(userId);

        if(user.isPresent()){
            return user.get();
        }
        throw new UserException("user not found with id "+userId);
    }

    @Override
    public User updateRoleUser(Long id, UserRoleRequest userRoleRequest) throws UserException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserException("User not found with id: " + id));
        String newRole = userRoleRequest.getRole();
        if (newRole == null || newRole.isEmpty()) {
            throw new IllegalArgumentException("Role cannot be null or empty");
        }

        UserRole userRoleEnum;
        try {
            userRoleEnum = UserRole.valueOf(newRole.toUpperCase());
            log.info("User role", userRoleEnum);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + newRole);
        }
        Role role = roleRepository.findByRoleName(userRoleEnum)
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + userRoleEnum.name()));
        user.setRole(role);
        return userRepository.save(user);
    }




    public String getVerifyKey() {
        UUID uuid = UUID.randomUUID();
        return uuid.toString();
    }

}
