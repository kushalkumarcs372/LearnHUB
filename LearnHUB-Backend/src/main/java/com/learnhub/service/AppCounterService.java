package com.learnhub.service;

import com.learnhub.entity.AppCounter;
import com.learnhub.repository.AppCounterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppCounterService {

    public static final String COUNTER_LOGINS = "logins";

    @Autowired
    private AppCounterRepository appCounterRepository;

    @Transactional
    public long increment(String key) {
        AppCounter counter = appCounterRepository.findById(key)
                .orElseGet(() -> new AppCounter(key, 0L));
        long next = (counter.getValue() == null ? 0L : counter.getValue()) + 1L;
        counter.setValue(next);
        appCounterRepository.save(counter);
        return next;
    }

    public long getValue(String key) {
        return appCounterRepository.findById(key)
                .map(c -> c.getValue() == null ? 0L : c.getValue())
                .orElse(0L);
    }
}

