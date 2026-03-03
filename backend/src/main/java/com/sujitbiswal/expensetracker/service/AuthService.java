package com.sujitbiswal.expensetracker.service;
import com.sujitbiswal.expensetracker.dto.*;
import com.sujitbiswal.expensetracker.model.User;
import com.sujitbiswal.expensetracker.repository.UserRepository;
import com.sujitbiswal.expensetracker.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername()))
            throw new RuntimeException("Username already exists!");
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered!");

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword())); // ENCRYPT!
        userRepository.save(user);

        return new AuthResponse(jwtUtil.generateToken(user.getUsername()), user.getUsername(), "Registration successful!");
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid password!");
        return new AuthResponse(jwtUtil.generateToken(user.getUsername()), user.getUsername(), "Login successful!");
    }
}