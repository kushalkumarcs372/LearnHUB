package com.learnhub.repository;

import com.learnhub.entity.AppCounter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppCounterRepository extends JpaRepository<AppCounter, String> {
}

