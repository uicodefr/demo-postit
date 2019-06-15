package com.uicode.postit.postitserver.mapper.postit;

import java.util.Date;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.uicode.postit.postitserver.dto.postit.PostitNoteDto;
import com.uicode.postit.postitserver.entity.postit.PostitNote;

@Mapper
public abstract class PostitNoteMapper {

    public static final PostitNoteMapper INSTANCE = Mappers.getMapper(PostitNoteMapper.class);

    @Mapping(target = "boardId", source = "board.id")
    @Mapping(target = "text", source = "textValue")
    public abstract PostitNoteDto toDto(PostitNote entity);

    public void updateEntity(PostitNoteDto dto, PostitNote entity) {
        if (dto == null || entity == null) {
            return;
        }
        if (dto.getName() != null) {
            entity.setName(dto.getName());
        }
        if (dto.getText() != null) {
            entity.setTextValue(dto.getText());
        }
        if (dto.getName() != null || dto.getText() != null) {
            entity.setUpdateTextDate(new Date());
        }
        if (dto.getColor() != null) {
            entity.setColor(dto.getColor());
        }
    }

}
