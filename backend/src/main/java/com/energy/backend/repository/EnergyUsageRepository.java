package com.energy.backend.repository;

import com.energy.backend.model.EnergyUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface EnergyUsageRepository extends JpaRepository<EnergyUsage, Long> {
    List<EnergyUsage> findByDeviceId(Long deviceId);
    List<EnergyUsage> findByDateBetween(LocalDate startDate, LocalDate endDate);
    boolean existsByDeviceIdAndDate(Long deviceId, LocalDate date);
    List<EnergyUsage> findByDateBetweenAndDeviceId(LocalDate startDate, LocalDate endDate, Long deviceId);
}