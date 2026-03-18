package com.uicode.postit.postitserver.mapper.global;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.security.core.GrantedAuthority;

import com.uicode.postit.postitserver.dto.global.UserDto;
import com.uicode.postit.postitserver.entity.global.User;

@Mapper(componentModel = "spring")
public abstract class UserMapper {

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "roleList", source = "authorities")
    public abstract UserDto toDto(User entity);

    protected String grantedAuthorityToString(GrantedAuthority grantedAuthority) {
        return grantedAuthority.getAuthority();
    }

    public void updateEntity(UserDto dto, User entity) {
        if (dto == null || entity == null) {
            return;
        }
        if (dto.getUsername() != null) {
            entity.setUsername(dto.getUsername());
        }
        if (dto.getEnabled() != null) {
            entity.setEnabled(dto.getEnabled());
        }
    }

}
