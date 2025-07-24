package com.energy.backend.service;

import com.energy.backend.model.Device;
import com.energy.backend.repository.DeviceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.energy.backend.repository.EnergyUsageRepository;

import java.util.List;

@Service
public class DeviceService {
    private final DeviceRepository deviceRepository;
    private final EnergyUsageRepository energyUsageRepository;

    public DeviceService(DeviceRepository deviceRepository, EnergyUsageRepository energyUsageRepository) {
        this.deviceRepository = deviceRepository;
        this.energyUsageRepository = energyUsageRepository;
    }

    public List<Device> findDevicesByUserId(Long userId) {
        return deviceRepository.findByUserId(userId);
    }

    public Device saveDevice(Device device) {
        return deviceRepository.save(device);
    }

    @Transactional
    public void deleteDevice(Long deviceId) {
         energyUsageRepository.deleteByDeviceId(deviceId);


        deviceRepository.deleteById(deviceId);
    }

    public List<Device> findAllDevices() {
        return deviceRepository.findAll();
    }

    public Device findById(Long deviceId) {
        return deviceRepository.findById(deviceId).orElse(null);
    }
    
}