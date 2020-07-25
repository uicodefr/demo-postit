package com.uicode.postit.postitserver.exception.functionnal;

import org.springframework.http.HttpStatus;

import com.uicode.postit.postitserver.exception.AppAbstractException;

public class ForbiddenException extends AppAbstractException {

    private static final long serialVersionUID = 2093090778191001557L;

    public ForbiddenException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.FORBIDDEN;
    }

}
