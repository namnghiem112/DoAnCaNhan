package com.example.btldoan.services.impl;

import com.example.btldoan.config.payment.VNPAYConfig;
import com.example.btldoan.config.payment.VNPayUtil;
import com.example.btldoan.domain.PaymentMethod;
import com.example.btldoan.models.Address;
import com.example.btldoan.response.PaymentResponse;
import com.example.btldoan.services.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.text.Normalizer;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final VNPAYConfig vnPayConfig;


    @Override
    public PaymentResponse<?> createVnPayPayment(HttpServletRequest request, Address shippingAddress, String jwt) {
        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();
        String orderInfo = removeAccents("Ho ten: " + shippingAddress.getFirstName() + " " + shippingAddress.getLastName()
                + ", Dia chi: " + shippingAddress.getAddress() + ", So dien thoai: " + shippingAddress.getMobile());
        vnpParamsMap.put("vnp_OrderInfo", orderInfo);
        String txnRef = vnpParamsMap.get("vnp_TxnRef"); // Tạo mã giao dịch
        if (shippingAddress.getId() == null) {
            shippingAddress.setId(generateRandomId()); // Hàm tạo id tự động
        }
        // Tạo URL thanh toán
        long amount = Integer.parseInt(request.getParameter("amount")) * 100L;
        String bankCode = request.getParameter("bankCode");
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        vnpParamsMap.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));

        String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;

        return PaymentResponse.builder()
                .status("ok")
                .message("success")
                .jwt(jwt)
                .addressData(shippingAddress)
                .responseData(paymentUrl).build();
    }
    private long generateRandomId() {
        Random random = new Random();
        return random.nextLong(); // Sinh giá trị ngẫu nhiên kiểu long
    }
    public static String removeAccents(String input) {
        // Chuyển chuỗi tiếng Việt có dấu thành dạng chuẩn hóa NFC (Normalization Form C)
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        // Loại bỏ các ký tự không phải chữ cái và dấu
        return normalized.replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
    }
}
