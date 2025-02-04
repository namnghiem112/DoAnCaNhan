package com.example.btldoan.services;

public interface MailService {
    void sendMailUpdatePassword(String verifyKey, String mailTo);
    void sendAccountCreatedEmail(String to, String username, String password, String recruiterEmail);
}
