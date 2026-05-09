package com.clinic.opd.service;

import com.clinic.opd.dto.PatientRequest;
import com.clinic.opd.dto.PatientResponse;
import com.clinic.opd.entity.Patient;
import com.clinic.opd.exception.ResourceNotFoundException;
import com.clinic.opd.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Transactional(readOnly = true)
    public List<PatientResponse> getAll() {
        return patientRepository.findAll()
                .stream()
                .map(PatientResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PatientResponse getById(Long id) {
        Patient patient = findOrThrow(id);
        return PatientResponse.from(patient);
    }

    @Transactional(readOnly = true)
    public List<PatientResponse> search(String query) {
        return patientRepository.searchByNameOrPhone(query)
                .stream()
                .map(PatientResponse::from)
                .collect(Collectors.toList());
    }

    public PatientResponse create(PatientRequest request) {
        Patient patient = new Patient();
        patient.setName(request.getName());
        patient.setGender(request.getGender());
        patient.setAge(request.getAge());
        patient.setPhone(request.getPhone());
        return PatientResponse.from(patientRepository.save(patient));
    }

    public PatientResponse update(Long id, PatientRequest request) {
        Patient patient = findOrThrow(id);
        patient.setName(request.getName());
        patient.setGender(request.getGender());
        patient.setAge(request.getAge());
        patient.setPhone(request.getPhone());
        return PatientResponse.from(patientRepository.save(patient));
    }

    public void delete(Long id) {
        Patient patient = findOrThrow(id);
        patientRepository.delete(patient);
    }

    private Patient findOrThrow(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
    }
}
