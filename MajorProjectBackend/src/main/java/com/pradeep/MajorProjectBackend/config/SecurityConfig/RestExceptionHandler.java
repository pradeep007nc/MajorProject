package com.pradeep.MajorProjectBackend.config.SecurityConfig;

import com.pradeep.MajorProjectBackend.Exceptions.AppException;
import com.pradeep.MajorProjectBackend.dto.SecuirtyDto.ErrorDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(value = {AppException.class})
    @ResponseBody
    public ResponseEntity<ErrorDto> handleException(AppException exception){
        return ResponseEntity.status(exception.getHttpStatus()).
                body(new ErrorDto(exception.getMessage()));
    }

}
