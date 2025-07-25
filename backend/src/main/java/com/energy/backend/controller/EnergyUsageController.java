package com.energy.backend.controller;

import com.energy.backend.model.Device;
import com.energy.backend.model.EnergyUsage;
import com.energy.backend.model.User;
import com.energy.backend.service.EnergyUsageService;
import com.energy.backend.service.DeviceService;
import com.energy.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/energy-usage")
public class EnergyUsageController {
    private final EnergyUsageService energyUsageService;
    private final DeviceService deviceService;
    private final UserService userService;

    public EnergyUsageController(EnergyUsageService energyUsageService, DeviceService deviceService, UserService userService) {
        this.energyUsageService = energyUsageService;
        this.deviceService = deviceService;
        this.userService = userService;
    }


    // Pobierz dane zużycia energii dla urządzenia
    @GetMapping("/{deviceId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<List<EnergyUsage>> getEnergyUsageByDevice(@PathVariable Long deviceId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User loggedInUser = userService.findByEmail(email);

        if (loggedInUser == null) {
            return ResponseEntity.status(403).build();
        }

        var device = deviceService.findById(deviceId);
        if (device == null || !device.getUser().getId().equals(loggedInUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        List<EnergyUsage> energyUsageList = energyUsageService.findByDeviceId(deviceId);
        return ResponseEntity.ok(energyUsageList);
    }

    // Pobierz dane zużycia energii w określonym przedziale czasowym
    @GetMapping("/{deviceId}/range")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<List<EnergyUsage>> getEnergyUsageByDateRange(
            @PathVariable Long deviceId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User loggedInUser = userService.findByEmail(email);

        if (loggedInUser == null) {
            return ResponseEntity.status(403).build();
        }

        var device = deviceService.findById(deviceId);
        if (device == null || !device.getUser().getId().equals(loggedInUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        List<EnergyUsage> energyUsageList = energyUsageService.findByDateRange(deviceId, startDate, endDate);
        return ResponseEntity.ok(energyUsageList);
    }

    // Usuń dane zużycia energii
    @DeleteMapping("/{energyUsageId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteEnergyUsage(@PathVariable Long energyUsageId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User loggedInUser = userService.findByEmail(email);

        if (loggedInUser == null) {
            return ResponseEntity.status(403).build();
        }

        EnergyUsage energyUsage = energyUsageService.findById(energyUsageId);
        if (energyUsage == null || !energyUsage.getDevice().getUser().getId().equals(loggedInUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        energyUsageService.deleteEnergyUsage(energyUsageId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/generate-missing")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> generateMissingEnergyUsageForAllDevices() {
        try {
            energyUsageService.generateMissingEnergyUsageForAllDevices();
            return ResponseEntity.ok("Missing energy usage entries generated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
        }
    }


    @GetMapping("/user/me/history")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<?> getEnergyUsageHistoryForCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User loggedInUser = userService.findByEmail(email);

        if (loggedInUser == null) {
            return ResponseEntity.status(403).body("User not found");
        }

        List<Device> devices = deviceService.findDevicesByUserId(loggedInUser.getId());
        if (devices.isEmpty()) {
            return ResponseEntity.ok("No devices found for the user");
        }

        List<EnergyUsage> energyUsageHistory = devices.stream()
            .flatMap(device -> energyUsageService.findByDeviceId(device.getId()).stream())
            .toList();

        return ResponseEntity.ok(energyUsageHistory);
    }
}