package com.energy.backend.controller;

import com.energy.backend.model.User;
import com.energy.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Pobierz wszystkich użytkowników (np. dla admina)
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Pobierz profil użytkownika po ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Pobierz profil użytkownika po emailu
    @GetMapping("/email/{email}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    // Pobierz użytkowników po roli
    @GetMapping("/role/{role}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<User> getUsersByRole(@PathVariable User.Role role) {
        return userRepository.findByRole(role);
    }

    @PutMapping("/set-energy-cost")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')") 
    public ResponseEntity<?> setEnergyCost(@RequestParam double energyCostPerKwh) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(403).body("User not found");
        }

        user.setEnergyCostPerKwh(energyCostPerKwh);
        userRepository.save(user);
        return ResponseEntity.ok("Energy cost updated successfully");
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<?> getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
}