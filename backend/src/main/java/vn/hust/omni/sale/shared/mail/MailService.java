package vn.hust.omni.sale.shared.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import vn.hust.omni.sale.shared.mail.model.SendConfirmCodeRegisterStore;
import vn.hust.omni.sale.shared.mail.model.SendInvitedManageStore;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.from}")
    private String emailFrom;

    @Async
    @EventListener(SendConfirmCodeRegisterStore.class)
    public void sendConfirmRegisterStoreCode(SendConfirmCodeRegisterStore event) throws UnsupportedEncodingException, MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
        Context context = new Context();

        Map<String, Object> properties = new HashMap<>();
        properties.put("recipientName", event.getFullName());
        properties.put("confirmCode", event.getConfirmCode());
        context.setVariables(properties);

        helper.setFrom(emailFrom, "HUST - One Love One Future");
        helper.setTo(event.getEmail());
        helper.setSubject("Mã kích hoạt cửa hàng");
        String html = templateEngine.process("send-confirm-code-register-store.html", context);
        helper.setText(html, true);

        mailSender.send(message);
        log.info("Confirm code has sent to user, email={}", event.getEmail());
    }

    @Async
    @EventListener(SendInvitedManageStore.class)
    public void sendInvitedManageStore(SendInvitedManageStore event) throws UnsupportedEncodingException, MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
        Context context = new Context();

        Map<String, Object> properties = new HashMap<>();
        properties.put("recipientName", event.getFullName());
        properties.put("storeName", event.getStoreName());
        properties.put("linkConfirm", String.format("http://localhost:5174/confirm_invited?email=%s&confirmCode=%s&storeId=%s", event.getEmail(), event.getConfirmCode(), event.getStoreId()));
        context.setVariables(properties);

        helper.setFrom(emailFrom, "HUST - One Love One Future");
        helper.setTo(event.getEmail());
        helper.setSubject("Xác nhận tham gia quản lý cửa hàng");
        String html = templateEngine.process("send-confirm-manage-store.html", context);
        helper.setText(html, true);

        mailSender.send(message);
        log.info("Confirm code has sent to user, email={}", event.getEmail());
    }
}
