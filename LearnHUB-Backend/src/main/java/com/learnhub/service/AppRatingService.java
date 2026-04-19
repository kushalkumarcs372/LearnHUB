package com.learnhub.service;

import com.learnhub.dto.AppRatingRequest;
import com.learnhub.entity.AppRating;
import com.learnhub.entity.User;
import com.learnhub.repository.AppRatingRepository;
import com.learnhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppRatingService {

    @Autowired
    private AppRatingRepository appRatingRepository;

    @Autowired
    private UserRepository userRepository;

    public AppRating getMyRating(Long userId) {
        return appRatingRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Rating not found"));
    }

    @Transactional
    public AppRating upsertMyRating(Long userId, AppRatingRequest request) {
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }
        if (request.getEaseOfUse() != null && (request.getEaseOfUse() < 1 || request.getEaseOfUse() > 5)) {
            throw new RuntimeException("Ease of use must be between 1 and 5");
        }
        if (request.getContentQuality() != null && (request.getContentQuality() < 1 || request.getContentQuality() > 5)) {
            throw new RuntimeException("Content quality must be between 1 and 5");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AppRating rating = appRatingRepository.findByUserId(userId).orElseGet(() -> {
            AppRating r = new AppRating();
            r.setUser(user);
            return r;
        });

        rating.setRating(request.getRating());
        rating.setRecommend(request.getRecommend());
        rating.setEaseOfUse(request.getEaseOfUse());
        rating.setContentQuality(request.getContentQuality());
        rating.setComment(request.getComment());

        return appRatingRepository.save(rating);
    }
}
