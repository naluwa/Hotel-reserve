package com.hotel.reservation.service;

import com.hotel.reservation.model.Customer;
import com.hotel.reservation.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public java.util.Optional<Customer> getCustomerById(String id) {
        return customerRepository.findById(id);
    }

    public java.util.Optional<Customer> getCustomerByNicPassport(String nicPassport) {
        return customerRepository.findByNicPassport(nicPassport);
    }

    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public void deleteById(String id) {
        customerRepository.deleteById(id);
    }
}
