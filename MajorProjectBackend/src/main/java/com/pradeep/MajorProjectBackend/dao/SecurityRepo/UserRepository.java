package com.pradeep.MajorProjectBackend.dao.SecurityRepo;


import com.pradeep.MajorProjectBackend.entity.SecurityUser.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByLogin(String login);

}
