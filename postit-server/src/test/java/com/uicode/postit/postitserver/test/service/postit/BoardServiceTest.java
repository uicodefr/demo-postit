package com.uicode.postit.postitserver.test.service.postit;

import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.uicode.postit.postitserver.dao.global.ParameterDao;
import com.uicode.postit.postitserver.dto.postit.BoardDto;
import com.uicode.postit.postitserver.entity.global.Parameter;
import com.uicode.postit.postitserver.exception.FunctionnalException;
import com.uicode.postit.postitserver.exception.NotFoundException;
import com.uicode.postit.postitserver.service.GlobalService;
import com.uicode.postit.postitserver.service.postit.BoardService;
import com.uicode.postit.postitserver.util.parameter.ParameterConst;

@SpringBootTest
@AutoConfigureTestDatabase
class BoardServiceTest {

    @MockBean
    private ParameterDao parameterDaoMock;

    @Autowired
    private GlobalService globalService;

    @Autowired
    private BoardService boardService;

    @Test
    void maxBoardError() throws NotFoundException, FunctionnalException {
        Parameter maxBoardParameter = new Parameter();
        maxBoardParameter.setName(ParameterConst.BOARD_MAX);
        maxBoardParameter.setValue("0");
        Mockito.when(parameterDaoMock.findById(ParameterConst.BOARD_MAX)).thenReturn(Optional.of(maxBoardParameter));
        globalService.clearCache();

        BoardDto boardDto = new BoardDto();
        boardDto.setName("Board error");
        Assertions.assertThatThrownBy(() -> boardService.saveBoard(null, boardDto))
            .isInstanceOf(FunctionnalException.class)
            .hasMessage("Max Board achieved : creation is blocked");
    }

    @Test
    void updateBoardNotFound() {
        Assertions.assertThatThrownBy(() -> boardService.saveBoard(12l, null))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("Board");
    }

    @Test
    void deleteBoardNotFound() {
        Assertions.assertThatCode(() -> boardService.deleteBoard(1234l)).doesNotThrowAnyException();
    }

}
