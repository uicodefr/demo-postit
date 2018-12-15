package com.uicode.postit.postitserver.dto.postit;

import com.uicode.postit.postitserver.dto.NamedEntityDto;

public class PostitNoteDto extends NamedEntityDto {

    private String text;

    private Long boardId;

    private String color;

    private Integer orderNum;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Long getBoardId() {
        return boardId;
    }

    public void setBoardId(Long boardId) {
        this.boardId = boardId;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(Integer orderNum) {
        this.orderNum = orderNum;
    }

}
