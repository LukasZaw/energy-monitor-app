package com.energy.backend.controller;

import com.energy.backend.model.User;
import com.energy.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public UserController(UserRepository userRepository, JdbcTemplate jdbcTemplate) {
        this.userRepository = userRepository;
        this.jdbcTemplate = jdbcTemplate;
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

    @PutMapping("/me")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<?> updateUser(@RequestBody User updatedUser) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(403).body("User not found");
        }

        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        userRepository.save(user);

        return ResponseEntity.ok("User updated successfully");
    }

    @GetMapping("/summary")
    public Map<String, Object> getStatsSummary() {
        Map<String, Object> stats = new HashMap<>();
        long totalUsers = userRepository.count();
        stats.put("totalUsers", totalUsers);

        return stats;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/signup-stats")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getSignupStats() {
        String query = """
            WITH RECURSIVE date_range AS (
                SELECT CURDATE() - INTERVAL 14 DAY AS signup_date
                UNION ALL
                SELECT signup_date + INTERVAL 1 DAY
                FROM date_range
                WHERE signup_date + INTERVAL 1 DAY <= CURDATE()
            )
            SELECT d.signup_date, COUNT(u.id) AS signup_count
            FROM date_range d
            LEFT JOIN users u ON DATE(u.created_at) = d.signup_date
            GROUP BY d.signup_date
            ORDER BY d.signup_date ASC
        """;

        List<Map<String, Object>> stats = jdbcTemplate.query(query, (rs, rowNum) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("date", rs.getDate("signup_date"));
            map.put("count", rs.getInt("signup_count"));
            return map;
        });

        return ResponseEntity.ok(stats);
    }
}