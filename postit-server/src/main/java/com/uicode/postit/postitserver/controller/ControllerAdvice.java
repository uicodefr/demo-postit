package com.uicode.postit.postitserver.controller;

import javax.validation.ConstraintViolationException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.uicode.postit.postitserver.dto.global.ErrorDto;
import com.uicode.postit.postitserver.service.IUserService;
import com.uicode.postit.postitserver.utils.exception.ForbiddenException;
import com.uicode.postit.postitserver.utils.exception.FunctionnalException;
import com.uicode.postit.postitserver.utils.exception.InvalidDataException;
import com.uicode.postit.postitserver.utils.exception.NotFoundException;

@RestControllerAdvice
public class ControllerAdvice {

    private static final Logger LOGGER = LogManager.getLogger(ControllerAdvice.class);

    @Autowired
    private IUserService userService;

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorDto> handleForbidden(final ForbiddenException exception) {
        return getErrorResponse(HttpStatus.FORBIDDEN, HttpStatus.FORBIDDEN.getReasonPhrase());
    }

    @ExceptionHandler(FunctionnalException.class)
    public ResponseEntity<ErrorDto> handleFunctionnalError(final FunctionnalException exception) {
        return getErrorResponse(HttpStatus.I_AM_A_TEAPOT, exception.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorDto> handleNotFound(final NotFoundException exception) {
        return getErrorResponse(HttpStatus.NOT_FOUND, HttpStatus.NOT_FOUND.getReasonPhrase());
    }

    @ExceptionHandler({ InvalidDataException.class, MissingServletRequestParameterException.class })
    public ResponseEntity<ErrorDto> handleBadRequest(final Exception exception) {
        return getErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(TransactionSystemException.class)
    public ResponseEntity<ErrorDto> handleConstraintViolation(TransactionSystemException exception) {
        Throwable cause = exception.getRootCause();
        if (cause instanceof ConstraintViolationException) {
            return getErrorResponse(HttpStatus.BAD_REQUEST, cause.getMessage());
        } else {
            return handleServerError(exception);
        }
    }

    @ExceptionHandler(Throwable.class)
    public ResponseEntity<ErrorDto> handleServerError(final Exception exception) {
        LOGGER.error(exception);
        return getErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, exception.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorDto> handleAccessDenied(final AccessDeniedException exception) {
        if (userService.getCurrentUser() == null) {
            return getErrorResponse(HttpStatus.UNAUTHORIZED, HttpStatus.UNAUTHORIZED.getReasonPhrase());
        } else {
            return getErrorResponse(HttpStatus.FORBIDDEN, HttpStatus.FORBIDDEN.getReasonPhrase());
        }
    }

    private ResponseEntity<ErrorDto> getErrorResponse(HttpStatus httpStatus, String message) {
        ErrorDto errorDto = new ErrorDto();
        errorDto.setStatus(String.valueOf(httpStatus.value()));
        errorDto.setMessage(message);
        return new ResponseEntity<>(errorDto, httpStatus);
    }

}
