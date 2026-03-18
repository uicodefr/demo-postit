package com.uicode.postit.postitserver.dto.global;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GlobalStatusDto {

    private String status;

    private Date upDate;

    private Date currentDate;

    private String version;

}
