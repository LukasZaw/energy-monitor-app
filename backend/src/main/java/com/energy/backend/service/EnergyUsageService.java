package com.energy.backend.service;

import com.energy.backend.model.Device;
import com.energy.backend.model.EnergyUsage;
import com.energy.backend.repository.EnergyUsageRepository;
import org.springframework.stereotype.Service;


import java.util.List;
import java.time.LocalDate;


@Service
public class EnergyUsageService {
    private final EnergyUsageRepository energyUsageRepository;
    private final DeviceService deviceService;

    public EnergyUsageService(EnergyUsageRepository energyUsageRepository, DeviceService deviceService) {
        this.energyUsageRepository = energyUsageRepository;
        this.deviceService = deviceService;
    }

    public List<EnergyUsage> findByDeviceId(Long deviceId) {
        return energyUsageRepository.findByDeviceId(deviceId);
    }

    public List<EnergyUsage> findByDateRange(Long deviceId, LocalDate startDate, LocalDate endDate) {
        return energyUsageRepository.findByDateBetweenAndDeviceId(startDate, endDate, deviceId);
    }

    public EnergyUsage saveEnergyUsage(EnergyUsage energyUsage) {
        return energyUsageRepository.save(energyUsage);
    }

    public EnergyUsage findById(Long energyUsageId) {
        return energyUsageRepository.findById(energyUsageId).orElse(null);
    }

    public void deleteEnergyUsage(Long energyUsageId) {
        energyUsageRepository.deleteById(energyUsageId);
    }

    public void generateMissingEnergyUsageForAllDevices() {
    List<Device> devices = deviceService.findAllDevices(); // Pobierz wszystkie urządzenia

    LocalDate today = LocalDate.now();

    for (Device device : devices) {
        LocalDate startDate = device.getCreatedAt().toLocalDate();

        for (LocalDate date = startDate; !date.isAfter(today); date = date.plusDays(1)) {
            boolean exists = energyUsageRepository.existsByDeviceIdAndDate(device.getId(), date);
            if (!exists) {
                double dailyEnergyKwh = (device.getPowerWatt() / 1000.0) * device.getDailyUsageHours();
                double cost = dailyEnergyKwh * device.getUser().getEnergyCostPerKwh();

                cost = new java.math.BigDecimal(cost)
                        .setScale(2, java.math.RoundingMode.HALF_UP)
                        .doubleValue();

                EnergyUsage energyUsage = new EnergyUsage();
                energyUsage.setDevice(device);
                energyUsage.setDate(date);
                energyUsage.setEnergyKwh(dailyEnergyKwh);
                energyUsage.setCost(cost);

                energyUsageRepository.save(energyUsage);
            }
        }
    }
}
}
