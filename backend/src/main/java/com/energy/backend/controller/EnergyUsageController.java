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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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


    // Fetch energy usage data for a specific device
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

    // Fetch energy usage data for a specific date range
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

    // Delete energy usage data
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

    // Generate missing energy usage entries for all devices
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

    // Fetch energy usage history for the current user
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

    // Fetch energy share for the current user
    @GetMapping("/user/me/device-share")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<?> getDeviceEnergyShareForCurrentUser() {
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

        Map<LocalDate, Map<String, Double>> groupedData = energyUsageHistory.stream()
            .collect(Collectors.groupingBy(
                EnergyUsage::getDate, 
                Collectors.groupingBy(
                    usage -> usage.getDevice().getName(), 
                    Collectors.summingDouble(EnergyUsage::getEnergyKwh)
                )
            ));

        List<Map<String, Object>> responseData = groupedData.entrySet().stream()
            .map(entry -> {
                LocalDate date = entry.getKey();
                Map<String, Double> deviceData = entry.getValue();

                Map<String, Object> dayData = new HashMap<>();
                dayData.put("date", date);
                dayData.put("devices", deviceData); 
                return dayData;
            })
            .toList();

        return ResponseEntity.ok(responseData);
    }

    // Fetch energy usage summary by device type for the current user
    @GetMapping("/user/me/type-summary")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<?> getEnergyUsageSummaryByDeviceType() {
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

        Map<String, Double> energyUsageByType = energyUsageHistory.stream()
            .collect(Collectors.groupingBy(
                usage -> usage.getDevice().getType(),
                Collectors.summingDouble(EnergyUsage::getEnergyKwh)
            ));

        List<Map<String, Object>> responseData = energyUsageByType.entrySet().stream()
            .map(entry -> {
                Map<String, Object> typeData = new HashMap<>();
                typeData.put("type", entry.getKey());
                typeData.put("totalEnergyKwh", entry.getValue());
                return typeData;
            })
            .toList();

        return ResponseEntity.ok(responseData);
    }

    // Fetch energy usage by device type for the current user
    @GetMapping("/user/me/type/{type}/devices")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<?> getEnergyUsageByDeviceType(@PathVariable String type) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User loggedInUser = userService.findByEmail(email);

        if (loggedInUser == null) {
            return ResponseEntity.status(403).body("User not found");
        }

        List<Device> devices = deviceService.findDevicesByUserId(loggedInUser.getId());
        if (devices.isEmpty()) {
            return ResponseEntity.ok("No devices found for the user");
        }

        List<Device> filteredDevices = devices.stream()
            .filter(device -> type.equalsIgnoreCase(device.getType()))
            .toList();

        if (filteredDevices.isEmpty()) {
            return ResponseEntity.ok("No devices of the specified type found for the user");
        }

        Map<String, Double> energyUsageByDevice = filteredDevices.stream()
            .collect(Collectors.toMap(
                Device::getName, 
                device -> energyUsageService.findByDeviceId(device.getId()).stream()
                    .mapToDouble(EnergyUsage::getEnergyKwh) 
                    .sum()
            ));

        List<Map<String, Object>> responseData = energyUsageByDevice.entrySet().stream()
            .map(entry -> {
                Map<String, Object> deviceData = new HashMap<>();
                deviceData.put("device", entry.getKey());
                deviceData.put("totalEnergyKwh", entry.getValue());
                return deviceData;
            })
            .toList();

        return ResponseEntity.ok(responseData);
    }

    // Get total kWh tracked by the application
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getTotalKwhTracked() {
        double totalKwhTracked = energyUsageService.getTotalEnergyUsage();

        Map<String, Object> summary = new HashMap<>();
        summary.put("kwhTracked", totalKwhTracked);

        return ResponseEntity.ok(summary);
    }
}