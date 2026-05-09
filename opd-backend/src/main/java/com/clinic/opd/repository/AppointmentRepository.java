package com.clinic.opd.repository;

import com.clinic.opd.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    @Query("SELECT a FROM Appointment a WHERE a.dateTime >= :start AND a.dateTime < :end ORDER BY a.dateTime ASC")
    List<Appointment> findTodaysAppointments(
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );
}
