package com.pradeep.MajorProjectBackend.Mappers;

import com.pradeep.MajorProjectBackend.dto.SecuirtyDto.SignupDto;
import com.pradeep.MajorProjectBackend.dto.SecuirtyDto.UserDto;
import com.pradeep.MajorProjectBackend.entity.SecurityUser.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDto(User user);

    @Mapping(target = "password", ignore = true)
    User signUpUser(SignupDto signupDto);

}
