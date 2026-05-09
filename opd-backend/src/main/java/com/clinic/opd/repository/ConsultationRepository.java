package com.clinic.opd.repository;

import com.clinic.opd.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    Optional<Consultation> findByAppointmentId(Long appointmentId);

    @Query("SELECT c FROM Consultation c WHERE c.appointment.patient.id = :patientId ORDER BY c.createdAt DESC")
    List<Consultation> findByPatientId(@Param("patientId") Long patientId);
}
