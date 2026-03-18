package com.uicode.postit.postitserver.mapper.postit;

import org.mapstruct.Mapper;

import com.uicode.postit.postitserver.dto.postit.BoardDto;
import com.uicode.postit.postitserver.entity.postit.Board;

@Mapper(componentModel = "spring")
public interface BoardMapper {

    BoardDto toDto(Board entity);

}
