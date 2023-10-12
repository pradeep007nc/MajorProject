package com.pradeep.MajorProjectBackend.controller.SecurityController;

import com.pradeep.dev.springBackend.Config.UserAuthProvider;
import com.pradeep.dev.springBackend.Dto.CredentialsDto;
import com.pradeep.dev.springBackend.Dto.SignupDto;
import com.pradeep.dev.springBackend.Dto.UserDto;
import com.pradeep.dev.springBackend.Services.UserService;
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
