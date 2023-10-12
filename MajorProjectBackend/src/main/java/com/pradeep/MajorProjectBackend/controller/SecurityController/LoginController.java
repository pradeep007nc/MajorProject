package com.pradeep.MajorProjectBackend.controller.SecurityController;

import com.pradeep.MajorProjectBackend.config.SecurityConfig.UserAuthProvider;
import com.pradeep.MajorProjectBackend.dto.SecuirtyDto.CredentialsDto;
import com.pradeep.MajorProjectBackend.dto.SecuirtyDto.SignupDto;
import com.pradeep.MajorProjectBackend.dto.SecuirtyDto.UserDto;
import com.pradeep.MajorProjectBackend.service.SecurityUserService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class LoginController {

    private final UserService userService;
    private final UserAuthProvider userAuthProvider;

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody CredentialsDto credentials){
        UserDto user = userService.login(credentials);
        user.setToken(userAuthProvider.createToken(user));
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody SignupDto signupDto){
        UserDto user = userService.register(signupDto);
        return ResponseEntity.created(URI.create("/users/"+user.getId())).body(user);
    }

}
