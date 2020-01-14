package com.uicode.postit.postitserver.exception;

public class ForbiddenException extends Exception {

    private static final long serialVersionUID = 2093090778191001557L;

    public ForbiddenException(String message) {
        super(message);
    }

}
