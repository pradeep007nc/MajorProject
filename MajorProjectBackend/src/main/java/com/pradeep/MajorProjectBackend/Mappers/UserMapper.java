package com.pradeep.MajorProjectBackend.Mappers;

import com.pradeep.dev.springBackend.Dto.SignupDto;
import com.pradeep.dev.springBackend.Dto.UserDto;
import com.pradeep.dev.springBackend.Entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDto(User user);

    @Mapping(target = "password", ignore = true)
    User signUpUser(SignupDto signupDto);

}
