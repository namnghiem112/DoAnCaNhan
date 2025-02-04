package com.example.btldoan.controllers;

import com.example.btldoan.request.RevenueByCategoryDTO;
import com.example.btldoan.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/revenue")
@RequiredArgsConstructor
public class RevenueController {
    private final OrderService orderService;
    // Doanh thu theo ngày trong một tháng
    @GetMapping("/daily")
    public Map<String, Double> getDailyRevenue(
            @RequestParam int month,
            @RequestParam int year
    ) {
        return orderService.getDailyRevenue(month, year);
    }

    // Doanh thu theo tháng trong một năm
    @GetMapping("/monthly")
    public Map<String, Double> getMonthlyRevenue(@RequestParam int year) {
        return orderService.getMonthlyRevenue(year);
    }

    // Doanh thu theo năm
    @GetMapping("/yearly")
    public Map<String, Double> getYearlyRevenue() {
        return orderService.getYearlyRevenue();
    }
    @GetMapping("/by-category")
    public List<RevenueByCategoryDTO> getRevenueByCategory() {
        return orderService.getRevenueByCategory();
    }
}
