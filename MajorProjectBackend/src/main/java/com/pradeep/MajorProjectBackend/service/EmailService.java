package com.pradeep.MajorProjectBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    public String sendMail(String email, String body){
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            //setting up
            message.setFrom(sender);
            message.setTo(email);
            message.setText(body);
            message.setSubject("Purchase details");

            //sending mail
            javaMailSender.send(message);
            return "Mail Sent Successfully...";
        }  catch (Exception e) {
            return "Error while Sending Mail";
        }
    }

}
