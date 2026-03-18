package com.uicode.postit.postitserver.test.service.global;

import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import com.uicode.postit.postitserver.dao.global.ParameterDao;
import com.uicode.postit.postitserver.dto.global.GlobalStatusDto;
import com.uicode.postit.postitserver.entity.global.Parameter;
import com.uicode.postit.postitserver.exception.functionnal.ForbiddenException;
import com.uicode.postit.postitserver.exception.functionnal.NotFoundException;
import com.uicode.postit.postitserver.service.global.GlobalService;
import com.uicode.postit.postitserver.util.parameter.ParameterConst;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("service-test")
class GlobalServiceTest {

    @MockitoBean
    private ParameterDao parameterDaoMock;

    @Autowired
    private GlobalService globalService;

    @Test
    void getStatus() {
        Parameter parameterTest1 = new Parameter();
        parameterTest1.setValue("test1");
        Mockito.when(parameterDaoMock.findById(ParameterConst.GENERAL_STATUS)).thenReturn(Optional.of(parameterTest1));
        GlobalStatusDto statusDto = globalService.getStatus();
        Assertions.assertThat(statusDto).isNotNull();
        Assertions.assertThat(statusDto.getStatus()).isEqualTo("test1");

        Mockito.when(parameterDaoMock.findById(ParameterConst.GENERAL_STATUS)).thenReturn(Optional.ofNullable(null));
        statusDto = globalService.getStatus();
        Assertions.assertThat(statusDto).isNotNull();
        Assertions.assertThat(statusDto.getStatus()).isNull();
    }

    @Test
    void getParameterValueForClient() throws NotFoundException, ForbiddenException {
        Parameter parameterTest1 = new Parameter();
        parameterTest1.setClientView(true);
        parameterTest1.setValue("testValue1");
        Mockito.when(parameterDaoMock.findById("testName1")).thenReturn(Optional.of(parameterTest1));
        String result1 = globalService.getParameterValueForClient("testName1");
        Assertions.assertThat(result1).isEqualTo("testValue1");

        Parameter parameterTest2 = new Parameter();
        parameterTest2.setClientView(false);
        parameterTest2.setValue("testValue2");
        Mockito.when(parameterDaoMock.findById("testName2")).thenReturn(Optional.of(parameterTest2));
        Assertions.assertThatThrownBy(() -> globalService.getParameterValueForClient("testName2"))
            .isInstanceOf(ForbiddenException.class);
    }

}
