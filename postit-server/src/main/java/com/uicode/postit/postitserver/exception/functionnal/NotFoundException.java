package com.uicode.postit.postitserver.exception.functionnal;

import org.springframework.http.HttpStatus;

import com.uicode.postit.postitserver.exception.AppAbstractException;

public class NotFoundException extends AppAbstractException {

    private static final long serialVersionUID = 6329551512840959981L;

    public NotFoundException(String message) {
        super(message + " not found");
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.NOT_FOUND;
    }

}
