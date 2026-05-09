package com.clinic.opd.service;

import com.clinic.opd.dto.AppointmentRequest;
import com.clinic.opd.dto.AppointmentResponse;
import com.clinic.opd.entity.Appointment;
import com.clinic.opd.entity.Patient;
import com.clinic.opd.exception.ResourceNotFoundException;
import com.clinic.opd.repository.AppointmentRepository;
import com.clinic.opd.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAll() {
        return appointmentRepository.findAll()
                .stream()
                .map(AppointmentResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getToday() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        return appointmentRepository.findTodaysAppointments(start, end)
                .stream()
                .map(AppointmentResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId)
                .stream()
                .map(AppointmentResponse::from)
                .collect(Collectors.toList());
    }

    public AppointmentResponse create(AppointmentRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found with id: " + request.getPatientId()));

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctorName(request.getDoctorName());
        appointment.setDateTime(request.getDateTime());
        appointment.setStatus(Appointment.Status.SCHEDULED);

        return AppointmentResponse.from(appointmentRepository.save(appointment));
    }

    public AppointmentResponse update(Long id, AppointmentRequest request) {
        Appointment appointment = findOrThrow(id);

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found with id: " + request.getPatientId()));

        appointment.setPatient(patient);
        appointment.setDoctorName(request.getDoctorName());
        appointment.setDateTime(request.getDateTime());

        return AppointmentResponse.from(appointmentRepository.save(appointment));
    }

    public AppointmentResponse cancel(Long id) {
        Appointment appointment = findOrThrow(id);
        appointment.setStatus(Appointment.Status.CANCELLED);
        return AppointmentResponse.from(appointmentRepository.save(appointment));
    }

    private Appointment findOrThrow(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Appointment not found with id: " + id));
    }
}
