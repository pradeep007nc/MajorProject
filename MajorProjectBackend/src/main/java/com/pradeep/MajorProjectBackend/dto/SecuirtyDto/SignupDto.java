package com.pradeep.MajorProjectBackend.dto.SecuirtyDto;

public record SignupDto(String firstName,
                        String lastName,
                        String login,
                        char[] password) {
}
