package com.clinic.opd.service;

import com.clinic.opd.dto.ConsultationRequest;
import com.clinic.opd.dto.ConsultationResponse;
import com.clinic.opd.entity.Appointment;
import com.clinic.opd.entity.Consultation;
import com.clinic.opd.exception.BadRequestException;
import com.clinic.opd.exception.ResourceNotFoundException;
import com.clinic.opd.repository.AppointmentRepository;
import com.clinic.opd.repository.ConsultationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final AppointmentRepository appointmentRepository;

    public ConsultationService(ConsultationRepository consultationRepository,
                               AppointmentRepository appointmentRepository) {
        this.consultationRepository = consultationRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Transactional(readOnly = true)
    public List<ConsultationResponse> getAll() {
        return consultationRepository.findAll()
                .stream()
                .map(ConsultationResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ConsultationResponse getByAppointment(Long appointmentId) {
        Consultation consultation = consultationRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Consultation not found for appointment id: " + appointmentId));
        return ConsultationResponse.from(consultation);
    }

    @Transactional(readOnly = true)
    public List<ConsultationResponse> getByPatient(Long patientId) {
        return consultationRepository.findByPatientId(patientId)
                .stream()
                .map(ConsultationResponse::from)
                .collect(Collectors.toList());
    }

    public ConsultationResponse create(ConsultationRequest request) {
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Appointment not found with id: " + request.getAppointmentId()));

        if (consultationRepository.findByAppointmentId(appointment.getId()).isPresent()) {
            throw new BadRequestException(
                    "Consultation already exists for appointment id: " + appointment.getId());
        }

        Consultation consultation = new Consultation();
        consultation.setAppointment(appointment);
        consultation.setBloodPressure(request.getBloodPressure());
        consultation.setTemperature(request.getTemperature());
        consultation.setNotes(request.getNotes());
        consultation.setStatus(Consultation.Status.COMPLETED);

        appointment.setStatus(Appointment.Status.COMPLETED);
        appointmentRepository.save(appointment);

        return ConsultationResponse.from(consultationRepository.save(consultation));
    }
}
