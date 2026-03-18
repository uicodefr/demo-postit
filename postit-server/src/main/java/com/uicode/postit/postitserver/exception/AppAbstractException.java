package com.uicode.postit.postitserver.exception;

import org.springframework.http.HttpStatus;

public abstract class AppAbstractException extends Exception {

    private static final long serialVersionUID = 5847072563164444146L;

    protected AppAbstractException(String message) {
        super(message);
    }

    protected AppAbstractException(String message, Throwable cause) {
        super(message, cause);
    }

    public abstract HttpStatus getHttpStatus();

}
