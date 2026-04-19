package com.learnhub.service;

import com.learnhub.dto.QuestionDTO;
import com.learnhub.dto.QuizRequest;
import com.learnhub.entity.Course;
import com.learnhub.entity.Question;
import com.learnhub.entity.Quiz;
import com.learnhub.repository.CourseRepository;
import com.learnhub.repository.QuestionRepository;
import com.learnhub.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private CourseRepository courseRepository;

    public List<Quiz> getCourseQuizzes(Long courseId) {
        return quizRepository.findByCourseId(courseId);
    }

    public Quiz getQuizById(Long id) {
        return quizRepository.findByIdWithQuestions(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
    }

    @Transactional
    public Quiz createQuiz(Long instructorId, QuizRequest request) {
        // Verify course exists and belongs to instructor
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to create quizzes for this course");
        }

        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setCourse(course);
        quiz.setTimeLimit(request.getTimeLimit());
        quiz.setPassingScore(request.getPassingScore());
        quiz.setMaxAttempts(request.getMaxAttempts() != null ? request.getMaxAttempts() : 1);

        quiz = quizRepository.save(quiz);

        // Create questions if provided
        if (request.getQuestions() != null && !request.getQuestions().isEmpty()) {
            int orderNumber = 1;
            for (QuestionDTO questionDTO : request.getQuestions()) {
                Question question = new Question();
                question.setQuestionText(questionDTO.getQuestionText());
                question.setOptionA(questionDTO.getOptionA());
                question.setOptionB(questionDTO.getOptionB());
                question.setOptionC(questionDTO.getOptionC());
                question.setOptionD(questionDTO.getOptionD());
                question.setCorrectAnswer(questionDTO.getCorrectAnswer());
                question.setOrderNumber(orderNumber++);
                question.setQuiz(quiz);
                questionRepository.save(question);
            }
        }

        return quiz;
    }

    @Transactional
    public Quiz updateQuiz(Long quizId, Long instructorId, QuizRequest request) {
        Quiz quiz = getQuizById(quizId);

        // Verify instructor owns the course
        if (!quiz.getCourse().getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to update this quiz");
        }

        if (request.getTitle() != null && !request.getTitle().isEmpty()) {
            quiz.setTitle(request.getTitle());
        }
        if (request.getTimeLimit() != null) {
            quiz.setTimeLimit(request.getTimeLimit());
        }
        if (request.getPassingScore() != null) {
            quiz.setPassingScore(request.getPassingScore());
        }
        if (request.getMaxAttempts() != null) {
            quiz.setMaxAttempts(request.getMaxAttempts());
        }

        // Update questions if provided
        if (request.getQuestions() != null && !request.getQuestions().isEmpty()) {
            // Delete existing questions
            questionRepository.deleteByQuizId(quizId);

            // Create new questions
            int orderNumber = 1;
            for (QuestionDTO questionDTO : request.getQuestions()) {
                Question question = new Question();
                question.setQuestionText(questionDTO.getQuestionText());
                question.setOptionA(questionDTO.getOptionA());
                question.setOptionB(questionDTO.getOptionB());
                question.setOptionC(questionDTO.getOptionC());
                question.setOptionD(questionDTO.getOptionD());
                question.setCorrectAnswer(questionDTO.getCorrectAnswer());
                question.setOrderNumber(orderNumber++);
                question.setQuiz(quiz);
                questionRepository.save(question);
            }
        }

        return quizRepository.save(quiz);
    }

    @Transactional
    public void deleteQuiz(Long quizId, Long instructorId) {
        Quiz quiz = getQuizById(quizId);

        // Verify instructor owns the course
        if (!quiz.getCourse().getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to delete this quiz");
        }

        quizRepository.delete(quiz);
    }
}
