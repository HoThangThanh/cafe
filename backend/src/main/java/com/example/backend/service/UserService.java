package com.example.backend.service;


import com.example.backend.model.User;
import com.example.backend.repo.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public User createUser(String username, String email, String rawPassword, String role) {
        User u = new User(username, email, encoder.encode(rawPassword), role);
        return repo.save(u);
    }
}
