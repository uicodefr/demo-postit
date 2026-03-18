package com.uicode.postit.postitserver.dto.global;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ErrorDto {

    private Date timestamp;

    private Integer status;

    private String error;

    private String message;

}
