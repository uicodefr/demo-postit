package com.uicode.postit.postitserver.mapper.global;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.security.core.GrantedAuthority;

import com.uicode.postit.postitserver.dto.global.UserDto;
import com.uicode.postit.postitserver.entity.global.User;

@Mapper
public abstract class UserMapper {

    public static final UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

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
        if (dto.isEnabled() != null) {
            entity.setEnabled(dto.isEnabled());
        }
    }

}
