package com.example.btldoan.controllers;

import com.example.btldoan.config.jwt.JwtUtils;
import com.example.btldoan.config.services.UserDetailsServiceImpl;
import com.example.btldoan.config.services.UserDetailsImpl;
import com.example.btldoan.domain.CommonConstant;
import com.example.btldoan.request.NewPasswordRequest;
import com.example.btldoan.domain.UserRole;
import com.example.btldoan.exception.UserException;
import com.example.btldoan.models.Role;
import com.example.btldoan.models.User;
import com.example.btldoan.repositories.RoleRepository;
import com.example.btldoan.repositories.UserRepository;
import com.example.btldoan.request.EmailRequest;
import com.example.btldoan.request.LoginRequest;
import com.example.btldoan.request.SignupRequest;
import com.example.btldoan.response.AuthResponse;
import com.example.btldoan.response.DataResponse;
import com.example.btldoan.response.MessageResponse;
import com.example.btldoan.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth/public")
@RequiredArgsConstructor
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private JwtUtils jwtTokenProvider;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;
    private final UserService userService;
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) throws UserException{

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        String strRoles = signUpRequest.getRole();
        Role role;
        if (strRoles == null || strRoles.isEmpty()) {
            role = roleRepository.findByRoleName(UserRole.ROLE_CUSTOMER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        } else {
            String roleStr = signUpRequest.getRole();
            if (roleStr.equals("admin")) {
                role = roleRepository.findByRoleName(UserRole.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            } else {
                role = roleRepository.findByRoleName(UserRole.ROLE_CUSTOMER)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            }
            user.setRole(role);
            user.setSignUpMethod("email");
            userRepository.save(user);
        }
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        Authentication authentication = authenticate(username, password);
        System.out.println(authentication.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String token = jwtTokenProvider.generateTokenFromEmail(userDetails);

//        String token = jwtTokenProvider.generateToken(authentication);
        AuthResponse authResponse= new AuthResponse();

        authResponse.setStatus(true);
        authResponse.setJwt(token);

        return new ResponseEntity<>(authResponse,HttpStatus.OK);
    }

    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(username);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username or password");
        }
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
    @PostMapping("/forgot")
    public ResponseEntity<?> forgot(@RequestBody EmailRequest emailRequest) {
        DataResponse resp = new DataResponse();
        String res = userService.forgotPassword(emailRequest.getEmail().trim());

        resp.setStatus(res);
        if (res.equals(CommonConstant.EMAIL_DONT_EXIST)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
        }
        return ResponseEntity.ok(resp);
    }
    @PostMapping("/resetpassword")
    public ResponseEntity<?> resetPassword(@RequestBody NewPasswordRequest newPasswordReq) {
        DataResponse resp = new DataResponse();
        boolean res = userService.resetPassword(newPasswordReq);
        if (res) resp.setStatus("OK");
        else resp.setStatus("NG");
        return ResponseEntity.ok(resp);
    }
    @GetMapping("/resetpassword")
    public ResponseEntity<?> getResetPassword(@RequestParam String verifyKey) {
        return ResponseEntity.ok().body(verifyKey);
    }
}
