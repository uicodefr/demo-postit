package com.uicode.postit.postitserver.utils;

import com.uicode.postit.postitserver.utils.exception.InvalidDataException;

public class CheckDataUtils {

    private CheckDataUtils() {
    }

    public static void checkNotNull(String message, Object... objectList) throws InvalidDataException {
        for (Object object : objectList) {
            if (object == null) {
                throw new InvalidDataException("checkNotNull : " + message);
            }
        }
    }

}
