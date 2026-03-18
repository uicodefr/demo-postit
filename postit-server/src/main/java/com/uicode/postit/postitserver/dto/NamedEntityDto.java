package com.uicode.postit.postitserver.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NamedEntityDto extends IdEntityDto {

    private String name;


    @Override
    public int hashCode() {
        return super.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof NamedEntityDto))
            return false;
       return super.equals(other);
    }
}
