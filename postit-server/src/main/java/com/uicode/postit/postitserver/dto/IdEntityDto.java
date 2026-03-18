package com.uicode.postit.postitserver.dto;

import java.util.Objects;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IdEntityDto {

    private Long id;


    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (!(obj instanceof IdEntityDto))
            return false;
        IdEntityDto other = (IdEntityDto) obj;
        return Objects.equals(id, other.id);
    }

}
