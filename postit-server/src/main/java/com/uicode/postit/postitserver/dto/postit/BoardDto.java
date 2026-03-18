package com.uicode.postit.postitserver.dto.postit;

import com.uicode.postit.postitserver.dto.NamedEntityDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardDto extends NamedEntityDto {

    private Integer orderNum;


    @Override
    public int hashCode() {
        return super.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof BoardDto))
            return false;
        return super.equals(other);
    }

}
