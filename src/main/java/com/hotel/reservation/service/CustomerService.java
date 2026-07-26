package com.hotel.reservation.service;

import com.hotel.reservation.model.Customer;
import com.hotel.reservation.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(String id) {
        return customerRepository.findById(id);
    }

    public Optional<Customer> getCustomerByNicPassport(String nicPassport) {
        return customerRepository.findByNicPassport(nicPassport);
    }

    public Customer saveCustomer(Customer customer) {
        String nicPassport = customer.getNicPassport();
        if (nicPassport != null && !nicPassport.isBlank() && customerRepository.findByNicPassport(nicPassport).isPresent()) {
            throw new IllegalArgumentException("A customer with this NIC/Passport is already registered.");
        }
        return customerRepository.save(customer);
    }

    public void deleteCustomer(String id) {
        customerRepository.deleteById(id);
    }
}
