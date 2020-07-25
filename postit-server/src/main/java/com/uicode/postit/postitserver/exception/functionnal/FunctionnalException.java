package com.uicode.postit.postitserver.exception.functionnal;

import org.springframework.http.HttpStatus;

import com.uicode.postit.postitserver.exception.AppAbstractException;

public class FunctionnalException extends AppAbstractException {

    private static final long serialVersionUID = -5571169012896600620L;

    public FunctionnalException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.CONFLICT;
    }

}
