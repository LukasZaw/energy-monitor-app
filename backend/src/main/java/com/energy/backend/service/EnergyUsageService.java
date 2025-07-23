package com.energy.backend.service;

import com.energy.backend.model.EnergyUsage;
import com.energy.backend.repository.EnergyUsageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.time.LocalDate;


@Service
public class EnergyUsageService {
    private final EnergyUsageRepository energyUsageRepository;

    public EnergyUsageService(EnergyUsageRepository energyUsageRepository) {
        this.energyUsageRepository = energyUsageRepository;
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
}
