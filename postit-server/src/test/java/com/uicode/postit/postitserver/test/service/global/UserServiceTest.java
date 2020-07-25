package com.uicode.postit.postitserver.test.service.global;

import java.util.Arrays;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.uicode.postit.postitserver.dao.global.ParameterDao;
import com.uicode.postit.postitserver.dto.global.UserDto;
import com.uicode.postit.postitserver.entity.global.Parameter;
import com.uicode.postit.postitserver.exception.functionnal.FunctionnalException;
import com.uicode.postit.postitserver.exception.functionnal.InvalidDataException;
import com.uicode.postit.postitserver.exception.functionnal.NotFoundException;
import com.uicode.postit.postitserver.service.global.GlobalService;
import com.uicode.postit.postitserver.service.global.UserService;
import com.uicode.postit.postitserver.util.parameter.ParameterConst;

@SpringBootTest
@AutoConfigureTestDatabase
class UserServiceTest {

    @Autowired
    private GlobalService globalService;

    @Autowired
    private UserService userService;

    @MockBean
    private ParameterDao parameterDaoMock;

    private void mockUserMaxParameter(Integer maxUserValue) {
        Parameter maxUserParameter = new Parameter();
        maxUserParameter.setName(ParameterConst.USER_MAX);
        maxUserParameter.setValue(maxUserValue.toString());
        Mockito.when(parameterDaoMock.findById(ParameterConst.USER_MAX)).thenReturn(Optional.of(maxUserParameter));
        globalService.clearCache();
    }

    @Test
    void loadUserNotFound() {
        Assertions.assertThatThrownBy(() -> userService.loadUserByUsername("loadUserNotFound"))
            .isInstanceOf(UsernameNotFoundException.class);
    }

    @Test
    void updateUserNotFound() {
        Assertions.assertThatThrownBy(() -> userService.saveUser(12l, null))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("User");
    }

    @Test
    void maxUserError() throws NotFoundException, FunctionnalException {
        mockUserMaxParameter(1);
        UserDto userDto = new UserDto();
        userDto.setUsername("maxUserError");
        Assertions.assertThatThrownBy(() -> userService.saveUser(null, userDto))
            .isInstanceOf(FunctionnalException.class)
            .hasMessageContaining("creation is blocked");
    }

    @Test
    void userPasswordInvalid() {
        mockUserMaxParameter(100);
        UserDto userDto = new UserDto();
        userDto.setUsername("userPasswordInvalid");
        userDto.setPassword("1234");

        Assertions.assertThatThrownBy(() -> userService.saveUser(null, userDto))
            .isInstanceOf(InvalidDataException.class)
            .hasMessage("Password of user is invalid");

        userDto.setPassword("             ");
        Assertions.assertThatThrownBy(() -> userService.saveUser(null, userDto))
            .isInstanceOf(InvalidDataException.class)
            .hasMessage("Password of user is invalid");
    }

    @Test
    void userInvalidRole() {
        mockUserMaxParameter(100);
        UserDto userDto = new UserDto();
        userDto.setUsername("userPasswordInvalid");
        userDto.setPassword("12346789");
        userDto.setRoleList(Arrays.asList("INVALID_ROLE"));

        Assertions.assertThatThrownBy(() -> userService.saveUser(null, userDto))
            .isInstanceOf(FunctionnalException.class)
            .hasMessageContaining("Role not found");
    }

    @Test
    void deleteUserNotFound() {
        Assertions.assertThatCode(() -> userService.deleteUser(1234l)).doesNotThrowAnyException();
    }

}
