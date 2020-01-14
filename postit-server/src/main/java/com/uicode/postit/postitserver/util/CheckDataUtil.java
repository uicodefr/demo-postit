package com.uicode.postit.postitserver.util;

import com.uicode.postit.postitserver.exception.InvalidDataException;

public class CheckDataUtil {

    private CheckDataUtil() {
    }

    public static void checkNotNull(String message, Object... objectList) throws InvalidDataException {
        for (Object object : objectList) {
            if (object == null) {
                throw new InvalidDataException("checkNotNull : " + message);
            }
        }
    }

}
