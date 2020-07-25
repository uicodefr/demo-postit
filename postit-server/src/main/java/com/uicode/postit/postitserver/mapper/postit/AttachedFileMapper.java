package com.uicode.postit.postitserver.mapper.postit;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.uicode.postit.postitserver.dto.postit.AttachedFileDto;
import com.uicode.postit.postitserver.entity.postit.AttachedFile;

@Mapper
public abstract class AttachedFileMapper {

    public static final AttachedFileMapper INSTANCE = Mappers.getMapper(AttachedFileMapper.class);

    @Mapping(target = "postitNoteId", source = "postitNote.id")
    public abstract AttachedFileDto toDto(AttachedFile entity);

}
