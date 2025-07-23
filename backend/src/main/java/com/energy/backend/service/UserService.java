package com.energy.backend.service;

import com.energy.backend.model.User;
import com.energy.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Rejestracja użytkownika
    @Transactional
    public User registerUser(String name, String email, String rawPassword) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email już istnieje");
        }
        if (name == null || name.length() < 3) {
            throw new IllegalArgumentException("Nazwa musi mieć co najmniej 3 znaki");
        }

        String hashedPassword = passwordEncoder.encode(rawPassword);
        User user = new User(name, email, hashedPassword, User.Role.USER); // Domyślna rola USER
        return userRepository.save(user);
    }

    // Logowanie użytkownika
    public User login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email);
        if (user == null || !passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Nieprawidłowy email lub hasło");
        }
        return user;
    }

    // Walidacja emaila
    public boolean isEmailTaken(String email) {
        return userRepository.existsByEmail(email);
    }

    // Walidacja nazwy
    public boolean isNameValid(String name) {
        return name != null && name.length() >= 3;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    //setEnergyCostPerKwh
    public void setEnergyCostPerKwh(Long userId, double energyCostPerKwh) {
        User user = findById(userId);
        user.setEnergyCostPerKwh(energyCostPerKwh);
        userRepository.save(user);
    }

    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Użytkownik o podanym ID nie istnieje"));
    }
}
