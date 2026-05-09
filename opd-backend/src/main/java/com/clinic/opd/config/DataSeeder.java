package com.clinic.opd.config;

import com.clinic.opd.entity.Appointment;
import com.clinic.opd.entity.Patient;
import com.clinic.opd.repository.AppointmentRepository;
import com.clinic.opd.repository.PatientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(PatientRepository patientRepo, AppointmentRepository appointmentRepo) {
        return args -> {
            if (patientRepo.count() > 0) return;

            Patient p1 = new Patient();
            p1.setName("Rahul Sharma");
            p1.setGender(Patient.Gender.MALE);
            p1.setAge(34);
            p1.setPhone("9876543210");
            patientRepo.save(p1);

            Patient p2 = new Patient();
            p2.setName("Priya Mehta");
            p2.setGender(Patient.Gender.FEMALE);
            p2.setAge(28);
            p2.setPhone("9123456789");
            patientRepo.save(p2);

            Patient p3 = new Patient();
            p3.setName("Ankit Patel");
            p3.setGender(Patient.Gender.MALE);
            p3.setAge(45);
            p3.setPhone("9000012345");
            patientRepo.save(p3);

            Appointment a1 = new Appointment();
            a1.setPatient(p1);
            a1.setDoctorName("Dr. Arjun Verma");
            a1.setDateTime(LocalDateTime.now().withHour(10).withMinute(0).withSecond(0));
            a1.setStatus(Appointment.Status.SCHEDULED);
            appointmentRepo.save(a1);

            Appointment a2 = new Appointment();
            a2.setPatient(p2);
            a2.setDoctorName("Dr. Sunita Rao");
            a2.setDateTime(LocalDateTime.now().withHour(11).withMinute(30).withSecond(0));
            a2.setStatus(Appointment.Status.SCHEDULED);
            appointmentRepo.save(a2);

            Appointment a3 = new Appointment();
            a3.setPatient(p3);
            a3.setDoctorName("Dr. Arjun Verma");
            a3.setDateTime(LocalDateTime.now().withHour(14).withMinute(0).withSecond(0));
            a3.setStatus(Appointment.Status.SCHEDULED);
            appointmentRepo.save(a3);
        };
    }
}
