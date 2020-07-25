package com.uicode.postit.postitserver.mapper.postit;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.uicode.postit.postitserver.dto.postit.BoardDto;
import com.uicode.postit.postitserver.entity.postit.Board;

@Mapper
public interface BoardMapper {

    public static final BoardMapper INSTANCE = Mappers.getMapper(BoardMapper.class);

    BoardDto toDto(Board entity);

}
