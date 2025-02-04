package com.example.btldoan.services.impl;

import com.example.btldoan.services.MailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class MailServiceImpl implements MailService {
    @Autowired
    private JavaMailSender mailSender;
    private final ExecutorService executorService = Executors.newFixedThreadPool(10);
    @Override
    public void sendMailUpdatePassword(String verifyKey, String mailTo) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
//            String link = "http://localhost:8080/api/auth/public/resetpassword" + "?verifyKey=" + verifyKey;
            String link = "http://localhost:3000/reset" + "?verifyKey=" + verifyKey;
            helper.setTo(mailTo);
            helper.setFrom("namnghiem0112@gmail.com");
            helper.setSubject("Confirm your email");

            String htmlContent = "<html>" + "<body>" + "Xin chào," + "<br><br>"
                    + "<input type=\"hidden\" th:value=\"${redirectUri}\" id=\"redirectUriTh\">"
                    + "<input type=\"hidden\" id=\"verifyKey\" value=\"" + verifyKey + "\">"
                    + "Nhấp vào nút bên dưới để đổi mật khẩu:" + "<br><br>" + "<a href=\""
                    + link + "\">"
                    + "<button id=\"nga\" style=\"background-color:blue; color:white; padding: 10px;\">Đổi mật khẩu</button>" + "</a>"
                    + "</body>" + "</html>";

            helper.setText(htmlContent, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void sendAccountCreatedEmail(String to, String username, String password, String recruiterEmail) {
        String subject = "No-reply-email-IMS-system <Account created>";
        String body = String.format("This email is from IMS system,\n\n" +
                "Your account has been created. Please use the following credential to login:\n\n" +
                "• Username: %s\n" +
                "• Password: %s\n\n" +
                "If anything wrong, please reach out to recruiter: %s. We are so sorry for this inconvenience.\n\n" +
                "Thanks & Regards!\n" +
                "IMS Team.", username, password, recruiterEmail);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }


    public static String convertDate(Date date) {
        // Create a SimpleDateFormat instance with the desired format
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
        // Format the date and return as a string
        return formatter.format(date);
    }

    public static String convertTime(String time) {
        // Define the input and output time formats
        DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("HH:mm");

        // Parse the input time string to a LocalTime object
        LocalTime localTime = LocalTime.parse(time, inputFormatter);

        // Format the LocalTime object to the desired output format
        return localTime.format(outputFormatter);
    }

    public String dateDiff(Date interviewDate) {
//        System.out.println(interviewDate);
        LocalDate interviewLocalDate = new java.sql.Date(interviewDate.getTime()).toLocalDate();
        LocalDate currentDate = LocalDate.now();

        // Calculate date difference
        Period period = Period.between(currentDate, interviewLocalDate);

        // Format the difference as a string
        int days = period.getDays();
        if (days == 0) {
            return "today";
        } else if (days == 1) {
            return "1 day";
        } else {
            return days + " days";
        }
    }
}
