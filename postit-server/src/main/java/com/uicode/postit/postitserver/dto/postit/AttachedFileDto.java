package com.uicode.postit.postitserver.dto.postit;

import com.uicode.postit.postitserver.dto.IdEntityDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttachedFileDto extends IdEntityDto {

    private Long postitNoteId;

    private String filename;

    private Long size;

    private String type;


    @Override
    public int hashCode() {
        return super.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof AttachedFileDto))
            return false;
        return super.equals(other);
    }

}
