package com.uicode.postit.postitserver.mapper.postit;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.uicode.postit.postitserver.dto.postit.AttachedFileDto;
import com.uicode.postit.postitserver.entity.postit.AttachedFile;

@Mapper(componentModel = "spring")
public abstract class AttachedFileMapper {

    @Mapping(target = "postitNoteId", source = "postitNote.id")
    public abstract AttachedFileDto toDto(AttachedFile entity);

}
