package com.uicode.postit.postitserver.dto.global;

import java.util.List;

import com.uicode.postit.postitserver.dto.IdEntityDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto extends IdEntityDto {

    private String username;

    private String password;

    private Boolean enabled;

    private List<String> roleList;


    @Override
    public int hashCode() {
        return super.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof UserDto))
            return false;
        return super.equals(other);
    }

}
