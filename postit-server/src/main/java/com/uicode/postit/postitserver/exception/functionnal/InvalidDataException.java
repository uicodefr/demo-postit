package com.uicode.postit.postitserver.exception.functionnal;

import org.springframework.http.HttpStatus;

import com.uicode.postit.postitserver.exception.AppAbstractException;

public class InvalidDataException extends AppAbstractException {

    private static final long serialVersionUID = 6433907447561227975L;

    public InvalidDataException(String message) {
        super(message);
    }

    public InvalidDataException(String message, Throwable cause) {
        super(message, cause);
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.BAD_REQUEST;
    }

}
