package com.uicode.postit.postitserver.dto.postit;

import com.uicode.postit.postitserver.dto.NamedEntityDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostitNoteDto extends NamedEntityDto {

    private String text;

    private Long boardId;

    private String color;

    private Integer orderNum;

    private AttachedFileDto attachedFile;


    @Override
    public int hashCode() {
        return super.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof PostitNoteDto))
            return false;
        return super.equals(other);
    }

}
