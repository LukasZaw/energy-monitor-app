package com.energy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.energy.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    User findByUsername(String username);

    boolean existsByEmail(String email);

    java.util.List<User> findByRole(User.Role role);

}
