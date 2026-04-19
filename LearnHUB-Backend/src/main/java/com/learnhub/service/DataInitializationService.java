package com.learnhub.service;

import com.learnhub.entity.*;
import com.learnhub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

import java.util.Arrays;
import java.util.List;

@Service
@Profile({"local", "h2"})
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
public class DataInitializationService implements CommandLineRunner {

    /**
     * When false, we only seed essentials (e.g., categories) and skip demo users/courses.
     * This keeps the student catalog clean: only instructor-created courses appear.
     */
    @Value("${app.seed.demo.enabled:false}")
    private boolean seedDemoContent;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LectureRepository lectureRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        boolean hasCourses = courseRepository.count() > 0;

        System.out.println("Starting demo data initialization...");

        // 1. Create Categories (idempotent by name)
        List<Category> categories = createCategories();
        System.out.println("Ensured " + categories.size() + " categories");

        // If demo seeding is disabled, stop after essentials (categories).
        if (!seedDemoContent) {
            System.out.println("Demo seeding disabled (app.seed.demo.enabled=false). Skipping demo users/courses.");
            return;
        }

        // 2. Create Users (idempotent by email)
        List<User> users = createUsers();
        System.out.println("Ensured " + users.size() + " users");

        // If the DB already has courses, do not create more demo content.
        if (hasCourses) {
            System.out.println("Courses already exist. Skipping demo courses/lectures/materials/quizzes seeding.");
            return;
        }

        // 3. Create Courses
        List<Course> courses = createCourses(categories, users);
        System.out.println("Created " + courses.size() + " courses");

        // 4. Create Lectures
        createLectures(courses);
        System.out.println("Created lectures");

        // 5. Create Materials
        createMaterials(courses);
        System.out.println("Created materials");

        // 6. Create Quizzes with Questions
        createQuizzesWithQuestions(courses);
        System.out.println("Created quizzes and questions");

        System.out.println("========================================");
        System.out.println("DEMO DATA INITIALIZATION COMPLETE!");
        System.out.println("========================================");
        System.out.println("\nSAMPLE LOGIN CREDENTIALS:");
        System.out.println("All passwords: password123\n");
        System.out.println("INSTRUCTORS:");
        System.out.println("  - sarah.instructor@learnhub.com");
        System.out.println("  - michael.instructor@learnhub.com");
        System.out.println("  - emily.instructor@learnhub.com\n");
        System.out.println("STUDENTS:");
        System.out.println("  - john.student@learnhub.com");
        System.out.println("  - alice.student@learnhub.com\n");
        System.out.println("ADMIN:");
        System.out.println("  - admin@learnhub.com");
        System.out.println("========================================");
    }

    private List<Category> createCategories() {
        return List.of(
                getOrCreateCategory("Programming", "Learn coding and software development with hands-on projects"),
                getOrCreateCategory("Business", "Business management, entrepreneurship, and leadership courses"),
                getOrCreateCategory("Design", "UI/UX design, graphic design, and creative skills"),
                getOrCreateCategory("Data Science", "Machine Learning, AI, Data Analytics, and Big Data"),
                getOrCreateCategory("Marketing", "Digital marketing, SEO, social media, and content marketing"),
                getOrCreateCategory("Personal Development", "Soft skills, productivity, and self-improvement"),
                getOrCreateCategory("Photography", "Photography techniques, editing, and visual storytelling"),
                getOrCreateCategory("Music", "Music theory, instruments, and music production")
        );
    }

    private Category createCategory(String name, String description) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        return category;
    }

    private Category getOrCreateCategory(String name, String description) {
        return categoryRepository.findByName(name)
                .orElseGet(() -> categoryRepository.save(createCategory(name, description)));
    }

    private List<User> createUsers() {
        String encodedPassword = passwordEncoder.encode("password123");

        return List.of(
                // Instructors
                getOrCreateUser("Dr. Sarah Johnson", "sarah.instructor@learnhub.com", encodedPassword,
                        User.UserRole.INSTRUCTOR, "Full Stack Developer with 10+ years of experience"),
                getOrCreateUser("Michael Chen", "michael.instructor@learnhub.com", encodedPassword,
                        User.UserRole.INSTRUCTOR, "Data Science expert and AI researcher"),
                getOrCreateUser("Emily Davis", "emily.instructor@learnhub.com", encodedPassword,
                        User.UserRole.INSTRUCTOR, "UI/UX Designer passionate about creating beautiful experiences"),

                // Students
                getOrCreateUser("John Student", "john.student@learnhub.com", encodedPassword,
                        User.UserRole.STUDENT, "Aspiring software developer"),
                getOrCreateUser("Alice Learning", "alice.student@learnhub.com", encodedPassword,
                        User.UserRole.STUDENT, "Career changer learning to code"),

                // Admin
                getOrCreateUser("Admin User", "admin@learnhub.com", encodedPassword,
                        User.UserRole.ADMIN, "Platform Administrator")
        );
    }

    private User createUser(String name, String email, String password, User.UserRole role, String bio) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        user.setBio(bio);
        return user;
    }

    private User getOrCreateUser(String name, String email, String encodedPassword, User.UserRole role, String bio) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(createUser(name, email, encodedPassword, role, bio)));
    }

    private List<Course> createCourses(List<Category> categories, List<User> users) {
        User instructor1 = users.get(0); // Sarah
        User instructor2 = users.get(1); // Michael
        User instructor3 = users.get(2); // Emily

        List<Course> courses = Arrays.asList(
                createCourse("Complete Web Development Bootcamp",
                        "Master HTML, CSS, JavaScript, React, Node.js, and MongoDB to become a full-stack web developer. Build 10+ real-world projects.",
                        categories.get(0), instructor1),

                createCourse("Python for Data Science",
                        "Learn Python programming and data analysis with pandas, NumPy, and visualization libraries. Perfect for beginners.",
                        categories.get(3), instructor2),

                createCourse("React & Redux Masterclass",
                        "Build modern web applications with React, Redux, React Router, and Hooks. Includes TypeScript and testing.",
                        categories.get(0), instructor1),

                createCourse("UI/UX Design Fundamentals",
                        "Learn user interface and user experience design principles. Master Figma, wireframing, and prototyping.",
                        categories.get(2), instructor3),

                createCourse("Digital Marketing Essentials",
                        "Master SEO, social media marketing, email marketing, and analytics to grow your business online.",
                        categories.get(4), instructor1)
        );

        return courseRepository.saveAll(courses);
    }

    private Course createCourse(String title, String description, Category category, User instructor) {
        Course course = new Course();
        course.setTitle(title);
        course.setDescription(description);
        course.setCategory(category);
        course.setInstructor(instructor);
        course.setPrice(0.0);
        course.setStatus(Course.CourseStatus.PUBLISHED);
        return course;
    }

    private void createLectures(List<Course> courses) {
        Course webDevCourse = courses.get(0);

        lectureRepository.saveAll(Arrays.asList(
                createLecture("Introduction to Web Development",
                        "Welcome to the Complete Web Development Bootcamp! In this lecture, we will cover:\n\n" +
                                "1. What is Web Development?\n2. Frontend vs Backend\n3. Tools and Technologies\n4. Career opportunities\n\n" +
                                "Web development is the work involved in developing websites and web applications for the Internet.",
                        webDevCourse, 1),

                createLecture("HTML Basics - Structure of Web Pages",
                        "HTML (HyperText Markup Language) is the standard markup language for creating web pages.\n\n" +
                                "Key Topics:\n- HTML Document Structure\n- Common HTML Tags\n- Lists and Forms\n- Semantic HTML5",
                        webDevCourse, 2),

                createLecture("CSS Fundamentals - Styling Your Pages",
                        "CSS (Cascading Style Sheets) is used to style and layout web pages.\n\n" +
                                "Topics: Selectors, Box Model, Flexbox, Grid, Responsive Design, Animations",
                        webDevCourse, 3),

                createLecture("JavaScript Essentials",
                        "JavaScript is the programming language of the web.\n\n" +
                                "Learn: Variables, Functions, DOM Manipulation, Events, Async Programming, ES6+ Features",
                        webDevCourse, 4),

                createLecture("Introduction to React",
                        "React is a popular JavaScript library for building user interfaces.\n\n" +
                                "Topics: Components, Props, State, Hooks, Routing, API Integration",
                        webDevCourse, 5)
        ));

        Course pythonCourse = courses.get(1);

        lectureRepository.saveAll(Arrays.asList(
                createLecture("Python Basics for Data Science",
                        "Introduction to Python programming language.\n\n" +
                                "Topics: Installation, Variables, Control Structures, Functions, File Handling",
                        pythonCourse, 1),

                createLecture("NumPy for Numerical Computing",
                        "NumPy is the fundamental package for scientific computing.\n\n" +
                                "Learn: Arrays, Operations, Indexing, Statistical Functions",
                        pythonCourse, 2),

                createLecture("Pandas for Data Analysis",
                        "Pandas provides data structures for large datasets.\n\n" +
                                "Topics: DataFrames, Data Loading, Cleaning, Grouping, Merging",
                        pythonCourse, 3)
        ));
    }

    private Lecture createLecture(String title, String content, Course course, int orderNumber) {
        Lecture lecture = new Lecture();
        lecture.setTitle(title);
        lecture.setContent(content);
        lecture.setCourse(course);
        lecture.setOrderNumber(orderNumber);
        return lecture;
    }

    private void createMaterials(List<Course> courses) {
        Course webDevCourse = courses.get(0);
        Course pythonCourse = courses.get(1);

        materialRepository.saveAll(Arrays.asList(
                createMaterial("HTML Cheat Sheet", "Complete reference guide for HTML tags",
                        "https://storage.learnhub.com/html-cheatsheet.pdf", "PDF", 2048576L, webDevCourse),

                createMaterial("CSS Grid Guide", "Comprehensive guide to CSS Grid Layout",
                        "https://storage.learnhub.com/css-grid-guide.pdf", "PDF", 3145728L, webDevCourse),

                createMaterial("JavaScript ES6+ Features", "Modern JavaScript features",
                        "https://storage.learnhub.com/js-es6.pdf", "PDF", 1572864L, webDevCourse),

                createMaterial("Python Quick Reference", "Python syntax reference",
                        "https://storage.learnhub.com/python-ref.pdf", "PDF", 1048576L, pythonCourse),

                createMaterial("Pandas Cheat Sheet", "Common Pandas operations",
                        "https://storage.learnhub.com/pandas-cheat.pdf", "PDF", 2097152L, pythonCourse)
        ));
    }

    private Material createMaterial(String title, String description, String fileUrl,
                                    String fileType, Long fileSize, Course course) {
        Material material = new Material();
        material.setTitle(title);
        material.setDescription(description);
        material.setFileUrl(fileUrl);
        material.setFileType(fileType);
        material.setFileSize(fileSize);
        material.setCourse(course);
        return material;
    }

    private void createQuizzesWithQuestions(List<Course> courses) {
        // Quiz 1: HTML & CSS Quiz
        Quiz htmlCssQuiz = createQuiz("HTML & CSS Fundamentals Quiz", courses.get(0), 30, 70, 3);
        htmlCssQuiz = quizRepository.save(htmlCssQuiz);

        questionRepository.saveAll(Arrays.asList(
                createQuestion("What does HTML stand for?",
                        "Hyper Text Markup Language", "High Tech Modern Language",
                        "Home Tool Markup Language", "Hyperlinks and Text Markup Language",
                        "A", 1, htmlCssQuiz),

                createQuestion("Which HTML tag is used for the largest heading?",
                        "<h6>", "<heading>", "<h1>", "<head>", "C", 2, htmlCssQuiz),

                createQuestion("What does CSS stand for?",
                        "Creative Style Sheets", "Cascading Style Sheets",
                        "Computer Style Sheets", "Colorful Style Sheets", "B", 3, htmlCssQuiz),

                createQuestion("Which property changes background color in CSS?",
                        "color", "bgcolor", "background-color", "bg-color", "C", 4, htmlCssQuiz),

                createQuestion("Which HTML tag creates a hyperlink?",
                        "<link>", "<a>", "<href>", "<url>", "B", 5, htmlCssQuiz)
        ));

        // Quiz 2: JavaScript Quiz
        Quiz jsQuiz = createQuiz("JavaScript Basics Quiz", courses.get(0), 45, 70, 3);
        jsQuiz = quizRepository.save(jsQuiz);

        questionRepository.saveAll(Arrays.asList(
                createQuestion("Which company developed JavaScript?",
                        "Microsoft", "Netscape", "Oracle", "Google", "B", 1, jsQuiz),

                createQuestion("How do you declare a variable in JavaScript?",
                        "variable myVar;", "var myVar;", "v myVar;", "declare myVar;", "B", 2, jsQuiz),

                createQuestion("Which method parses a string to integer?",
                        "parseInt()", "parseInteger()", "toInteger()", "convert()", "A", 3, jsQuiz),

                createQuestion("What is the correct syntax for a for loop?",
                        "for (i = 0; i < 5)", "for (i = 0; i < 5; i++)",
                        "for i = 1 to 5", "loop (i = 0; i < 5)", "B", 4, jsQuiz),

                createQuestion("Which operator is used for strict equality?",
                        "=", "==", "===", "equals", "C", 5, jsQuiz)
        ));

        // Quiz 3: Python Quiz
        Quiz pythonQuiz = createQuiz("Python Fundamentals Quiz", courses.get(1), 30, 70, 3);
        pythonQuiz = quizRepository.save(pythonQuiz);

        questionRepository.saveAll(Arrays.asList(
                createQuestion("Which keyword defines a function in Python?",
                        "function", "def", "func", "define", "B", 1, pythonQuiz),

                createQuestion("What is the output of print(2 ** 3)?",
                        "6", "8", "9", "5", "B", 2, pythonQuiz),

                createQuestion("Which data type is mutable in Python?",
                        "tuple", "string", "list", "integer", "C", 3, pythonQuiz),

                createQuestion("How do you start a comment in Python?",
                        "//", "#", "/*", "--", "B", 4, pythonQuiz),

                createQuestion("Which library is used for data manipulation?",
                        "NumPy", "Pandas", "Matplotlib", "SciPy", "B", 5, pythonQuiz)
        ));
    }

    private Quiz createQuiz(String title, Course course, int timeLimit, int passingScore, int maxAttempts) {
        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setCourse(course);
        quiz.setTimeLimit(timeLimit);
        quiz.setPassingScore(passingScore);
        quiz.setMaxAttempts(maxAttempts);
        return quiz;
    }

    private Question createQuestion(String questionText, String optionA, String optionB,
                                    String optionC, String optionD, String correctAnswer,
                                    int orderNumber, Quiz quiz) {
        Question question = new Question();
        question.setQuestionText(questionText);
        question.setOptionA(optionA);
        question.setOptionB(optionB);
        question.setOptionC(optionC);
        question.setOptionD(optionD);
        question.setCorrectAnswer(correctAnswer);
        question.setOrderNumber(orderNumber);
        question.setQuiz(quiz);
        return question;
    }
}
