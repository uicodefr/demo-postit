package com.uicode.postit.postitserver.util;

import java.util.stream.Collectors;

import javax.validation.ConstraintViolationException;

import com.uicode.postit.postitserver.exception.functionnal.InvalidDataException;

public class ExceptionUtil {

    private ExceptionUtil() {
    }

    public static InvalidDataException convert(ConstraintViolationException cause) {
        String message = "Invalid data for " + cause.getConstraintViolations()
            .stream()
            .map(constraintViolation -> constraintViolation.getPropertyPath() + " (" + constraintViolation.getMessage()
                    + ")")
            .collect(Collectors.joining(", "));

        return new InvalidDataException(message, cause);
    }

}
