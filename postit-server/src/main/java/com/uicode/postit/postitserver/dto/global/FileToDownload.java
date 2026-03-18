package com.uicode.postit.postitserver.dto.global;

import java.io.InputStream;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileToDownload {

    private String filename;

    private InputStream inputStream;

    private Long size;

    private String type;

}
