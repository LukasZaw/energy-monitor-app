package com.energy.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Domyślny konstruktor wymagany przez Hibernate
    public User() {
    }

    // Konstruktor z argumentami
    public User(String name, String email, String hashedPassword, Role role) {
        this.username = name;
        this.email = email;
        this.password = hashedPassword;
        this.role = role;
    }

    public enum Role {
        USER,
        ADMIN
    }
}