package com.pradeep.MajorProjectBackend.Mappers;

import com.pradeep.MajorProjectBackend.dto.SecuirtyDto.SignupDto;
import com.pradeep.MajorProjectBackend.dto.SecuirtyDto.UserDto;
import com.pradeep.MajorProjectBackend.entity.SecurityUser.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-10-12T13:17:16+0530",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 20.0.1 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto toUserDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDto.UserDtoBuilder userDto = UserDto.builder();

        if ( user.getId() != null ) {
            userDto.id( user.getId() );
        }
        userDto.firstName( user.getFirstName() );
        userDto.login( user.getLogin() );

        return userDto.build();
    }

    @Override
    public User signUpUser(SignupDto signupDto) {
        if ( signupDto == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.firstName( signupDto.firstName() );
        user.login( signupDto.login() );

        return user.build();
    }
}
