package com.uicode.postit.postitserver.dto.postit;

import com.uicode.postit.postitserver.dto.NamedEntityDto;

public class BoardDto extends NamedEntityDto {

    private Integer orderNum;

    public Integer getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(Integer orderNum) {
        this.orderNum = orderNum;
    }

}
