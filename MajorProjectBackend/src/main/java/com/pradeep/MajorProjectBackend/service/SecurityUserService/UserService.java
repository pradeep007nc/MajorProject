package com.pradeep.MajorProjectBackend.service.SecurityUserService;

import com.pradeep.MajorProjectBackend.Exceptions.AppException;
import com.pradeep.MajorProjectBackend.Mappers.UserMapper;
import com.pradeep.MajorProjectBackend.dao.SecurityRepo.UserRepository;
import com.pradeep.MajorProjectBackend.dto.SecuirtyDto.CredentialsDto;
import com.pradeep.MajorProjectBackend.dto.SecuirtyDto.SignupDto;
import com.pradeep.MajorProjectBackend.dto.SecuirtyDto.UserDto;
import com.pradeep.MajorProjectBackend.entity.SecurityUser.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    public final UserRepository userRepository;
    public final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserDto login(CredentialsDto credentialsDto){
        User user = userRepository.findByLogin(credentialsDto.login())
                .orElseThrow(() -> new AppException("Unknown User", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.password())
        ,user.getPassword())){
            return userMapper.toUserDto(user);
        }
        throw new AppException("Invalid Password", HttpStatus.BAD_REQUEST);
    }

    public UserDto register(SignupDto signupDto){
        Optional<User> user = userRepository.findByLogin(signupDto.login());
        if (user.isPresent()){
            throw new AppException("login already exists", HttpStatus.BAD_REQUEST);
        }

        User user1 = userMapper.signUpUser(signupDto);
        user1.setPassword(passwordEncoder.encode(CharBuffer.wrap(signupDto.password())));
        User savedUser = userRepository.save(user1);
        return userMapper.toUserDto(savedUser);
    }

    public UserDto findByLogin(String login) {
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        return userMapper.toUserDto(user);
    }
}
