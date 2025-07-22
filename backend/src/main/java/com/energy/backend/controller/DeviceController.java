package com.energy.backend.controller;

import com.energy.backend.model.Device;
import com.energy.backend.model.User;
import com.energy.backend.service.DeviceService;
import com.energy.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {
    private final DeviceService deviceService;
    private final UserService userService;

    public DeviceController(DeviceService deviceService, UserService userService) {
        this.deviceService = deviceService;
        this.userService = userService;
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
    public ResponseEntity<Device> addDevice(@RequestBody Device device, @RequestParam Long userId) {
        
        //TODO ???
        User user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body(null);
        }
        device.setUser(user);
        Device savedDevice = deviceService.saveDevice(device);
        return ResponseEntity.ok(savedDevice);
    }

    // Zaktualizuj urządzenie
    @PutMapping("/{deviceId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Device> updateDevice(@PathVariable Long deviceId, @RequestBody Device updatedDevice) {
        Device existingDevice = deviceService.findById(deviceId);
        if (existingDevice == null) {
            return ResponseEntity.notFound().build();
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
        Device device = deviceService.findById(deviceId);
        if (device == null) {
            return ResponseEntity.notFound().build();
        }
        deviceService.deleteDevice(deviceId);
        return ResponseEntity.noContent().build();
    }
}