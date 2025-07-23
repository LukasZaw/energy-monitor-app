package com.energy.backend.controller;

import com.energy.backend.model.Device;
import com.energy.backend.model.EnergyUsage;
import com.energy.backend.model.User;
import com.energy.backend.service.DeviceService;
import com.energy.backend.service.EnergyUsageService;
import com.energy.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {
    private final DeviceService deviceService;
    private final UserService userService;
    private final EnergyUsageService energyUsageService;

    public DeviceController(DeviceService deviceService, UserService userService, EnergyUsageService energyUsageService) {
        this.deviceService = deviceService;
        this.userService = userService;
        this.energyUsageService = energyUsageService;
    }

    // Pobierz wszystkie urządzenia
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Device>> getAllDevices() {
        List<Device> devices = deviceService.findAllDevices();
        return ResponseEntity.ok(devices);
    }

    // Pobierz urządzenia użytkownika
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<List<Device>> getDevicesByUserId(@PathVariable Long userId) {
        List<Device> devices = deviceService.findDevicesByUserId(userId);
        return ResponseEntity.ok(devices);
    }

    // Dodaj nowe urządzenie
    @PostMapping
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Device> addDevice(@RequestBody Device device) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body(null);
        }

        device.setUser(user);
        Device savedDevice = deviceService.saveDevice(device);

        double energyCostPerKwh = user.getEnergyCostPerKwh();

        double dailyEnergyKwh = (device.getPowerWatt() / 1000.0) * device.getDailyUsageHours();
        double cost = dailyEnergyKwh * energyCostPerKwh;

        EnergyUsage energyUsage = new EnergyUsage();
        energyUsage.setDevice(savedDevice);
        energyUsage.setDate(LocalDate.now());
        energyUsage.setEnergyKwh(dailyEnergyKwh);
        energyUsage.setCost(cost);

        energyUsageService.saveEnergyUsage(energyUsage);

        return ResponseEntity.ok(savedDevice);
    }

    // Zaktualizuj urządzenie
    @PutMapping("/{deviceId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Device> updateDevice(@PathVariable Long deviceId, @RequestBody Device updatedDevice) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User loggedInUser = userService.findByEmail(email);
        if (loggedInUser == null) {
            return ResponseEntity.status(403).build();
        }

        Device existingDevice = deviceService.findById(deviceId);
        if (existingDevice == null) {
            return ResponseEntity.notFound().build();
        }

        if (!existingDevice.getUser().getId().equals(loggedInUser.getId())) {
            return ResponseEntity.status(403).build(); 
        }

        existingDevice.setName(updatedDevice.getName());
        existingDevice.setPowerWatt(updatedDevice.getPowerWatt());
        existingDevice.setDailyUsageHours(updatedDevice.getDailyUsageHours());
        existingDevice.setType(updatedDevice.getType());
        Device savedDevice = deviceService.saveDevice(existingDevice);

        return ResponseEntity.ok(savedDevice);
    }

    // Usuń urządzenie
    @DeleteMapping("/{deviceId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long deviceId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User loggedInUser = userService.findByEmail(email);
        if (loggedInUser == null) {
            return ResponseEntity.status(403).build();
        }

        Device device = deviceService.findById(deviceId);
        if (device == null) {
            return ResponseEntity.notFound().build();
        }

        if (!device.getUser().getId().equals(loggedInUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        deviceService.deleteDevice(deviceId);
        return ResponseEntity.noContent().build();
    }
}