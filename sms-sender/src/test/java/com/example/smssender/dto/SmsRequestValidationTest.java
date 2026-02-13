package com.example.smssender.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class SmsRequestValidationTest {

    private static ValidatorFactory factory;
    private static Validator validator;

    @BeforeAll
    public static void setUp() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    public static void tearDown() {
        factory.close();
    }

    @Test
    public void testInvalidPhoneNumber() {
        SmsRequest req = new SmsRequest();
        req.setPhoneNumber("123");
        req.setMessage("Hello");

        Set violations = validator.validate(req);
        assertFalse(violations.isEmpty());
    }

    @Test
    public void testEmptyMessage() {
        SmsRequest req = new SmsRequest();
        req.setPhoneNumber("+14155552671");
        req.setMessage("");

        Set violations = validator.validate(req);
        assertFalse(violations.isEmpty());
    }

    @Test
    public void testValidRequest() {
        SmsRequest req = new SmsRequest();
        req.setPhoneNumber("+14155552671");
        req.setMessage("Hello world");

        Set violations = validator.validate(req);
        assertTrue(violations.isEmpty());
    }
}
