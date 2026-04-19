package com.learnhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LearnhubApplication {

    public static void main(String[] args) {
        SpringApplication.run(LearnhubApplication.class, args);
        System.out.println("=================================");
        System.out.println("LearnHub Backend is Running!");
        System.out.println("Server: http://localhost:8080");
        System.out.println("=================================");
    }
}
