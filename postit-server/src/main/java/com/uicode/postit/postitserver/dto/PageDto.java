package com.uicode.postit.postitserver.dto;

import java.util.List;
import java.util.function.Function;

import org.springframework.data.domain.Page;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PageDto<T> {

    public static <T, E> PageDto<T> of(Page<E> entitiesPage, Function<E, T> mapperEntityToDto) {
        PageDto<T> pageDto = new PageDto<>();
        pageDto.setTotalPages(entitiesPage.getTotalPages());
        pageDto.setTotalElements(entitiesPage.getTotalElements());
        pageDto.setElements(entitiesPage.getContent().stream().map(mapperEntityToDto).toList());
        return pageDto;
    }

    private List<T> elements;

    private Long totalElements;

    private Integer totalPages;

}
