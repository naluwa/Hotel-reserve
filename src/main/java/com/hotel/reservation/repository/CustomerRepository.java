

package com.hotel.reservation.repository;

import com.hotel.reservation.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface CustomerRepository extends MongoRepository<Customer, String> {
    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByNicPassport(String nicPassport);
    boolean existsByEmail(String email);
}
