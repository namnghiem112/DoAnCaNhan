package com.example.btldoan.services.impl;

import com.example.btldoan.exception.CartItemException;
import com.example.btldoan.exception.OrderException;
import com.example.btldoan.exception.UserException;
import com.example.btldoan.models.*;
import com.example.btldoan.repositories.*;
import com.example.btldoan.request.RevenueByCategoryDTO;
import com.example.btldoan.services.CartItemService;
import com.example.btldoan.services.CartService;
import com.example.btldoan.services.OrderItemService;
import com.example.btldoan.services.OrderService;
import com.example.btldoan.domain.OrderStatus;
import com.example.btldoan.domain.PaymentStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

//    @Override
//    @Transactional
//    public Order createOrder(User user, Address shippAddress) throws CartItemException, UserException {
//        // Kiểm tra giỏ hàng trống
//        Cart cart = cartService.findUserCart(user.getId());
//        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
//            throw new CartItemException("Giỏ hàng trống, không thể tạo đơn hàng.");
//        }
//
//        // Lưu địa chỉ giao hàng vào cơ sở dữ liệu
//        shippAddress.setUser(user);
//        Address address = addressRepository.save(shippAddress);
//        user.getAddress().add(address);
//        userRepository.save(user);
//
//        // Tạo các OrderItem từ CartItem
//        List<OrderItem> orderItems = new ArrayList<>();
//        for (CartItem item : cart.getCartItems()) {
//            OrderItem orderItem = new OrderItem();
//            orderItem.setPrice(item.getPrice());
//            orderItem.setProduct(item.getProduct());
//            orderItem.setQuantity(item.getQuantity());
//            orderItem.setSize(item.getSize());
//            orderItem.setUserId(item.getUserId());
//            orderItem.setDiscountedPrice(item.getDiscountedPrice());
//            orderItem.setOrder(null); // Thiết lập mối quan hệ Order sau khi Order được lưu
//
//            orderItems.add(orderItem);
//        }
//
//        // Tạo Order và lưu vào cơ sở dữ liệu
//        Order createdOrder = new Order();
//        createdOrder.setUser(user);
//        createdOrder.setOrderItems(orderItems);
//        createdOrder.setTotalPrice(cart.getTotalPrice());
//        createdOrder.setTotalDiscountedPrice(cart.getTotalDiscountedPrice());
//        createdOrder.setDiscounte(cart.getDiscounte());
//        createdOrder.setTotalItem(cart.getTotalItem());
//        createdOrder.setShippingAddress(address);
//        createdOrder.setOrderDate(LocalDateTime.now());
//        createdOrder.setOrderStatus(OrderStatus.PENDING);
//        createdOrder.setPaymentMethod(shippAddress.getPaymentMethod());
//        createdOrder.setCreatedAt(LocalDateTime.now());
//
//        // Lưu Order và lấy lại Order đã lưu
//        Order savedOrder = orderRepository.save(createdOrder);
//
//        // Gán Order cho từng OrderItem và lưu chúng
//        for (OrderItem orderItem : orderItems) {
//            orderItem.setOrder(savedOrder);
//            orderItemRepository.save(orderItem);
//        }
//
//        // Xóa từng CartItem trong giỏ hàng
//        for (CartItem item : cart.getCartItems()) {
//            Optional<CartItem> cartItemOpt = cartItemRepository.findById(item.getId());
//            if (cartItemOpt.isPresent()) {
//                cartItemRepository.deleteById(item.getId());
//                log.info("Removed item {}", item.getId());
//            } else {
//                log.error("Cart item with id {} not found", item.getId());
//            }
//        }
//        cart.setTotalItem(0);
//        cart.setDiscounte(0);
//        cart.setTotalDiscountedPrice(0);
//        cart.setTotalPrice(0);
//        cartRepository.save(cart);
//
//        return savedOrder;
//    }
    @Override
    @Transactional
    public Order createOrder(User user, Address shippAddress) throws CartItemException, UserException {
        // Kiểm tra giỏ hàng trống
        Cart cart = cartService.findUserCart(user.getId());
        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new CartItemException("Giỏ hàng trống, không thể tạo đơn hàng.");
        }

        // Lưu địa chỉ giao hàng vào cơ sở dữ liệu
        shippAddress.setUser(user);
        Address address = addressRepository.save(shippAddress);
        user.getAddress().add(address);
        userRepository.save(user);

        // Tạo các OrderItem từ CartItem
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem item : cart.getCartItems()) {
            // Giảm số lượng sản phẩm trong kho
            Product product = item.getProduct();
            if (product.getQuantity() < item.getQuantity()) {
                throw new CartItemException(
                        "Số lượng sản phẩm " + product.getTitle() + " không đủ để đặt hàng."
                );
            }
            product.setQuantity(product.getQuantity() - item.getQuantity());
            productRepository.save(product); // Cập nhật số lượng sản phẩm

            // Tạo OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setPrice(item.getPrice());
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setSize(item.getSize());
            orderItem.setUserId(item.getUserId());
            orderItem.setDiscountedPrice(item.getDiscountedPrice());
            orderItem.setOrder(null); // Thiết lập mối quan hệ Order sau khi Order được lưu

            orderItems.add(orderItem);
        }

        // Tạo Order và lưu vào cơ sở dữ liệu
        Order createdOrder = new Order();
        createdOrder.setUser(user);
        createdOrder.setOrderItems(orderItems);
        createdOrder.setTotalPrice(cart.getTotalPrice());
        createdOrder.setTotalDiscountedPrice(cart.getTotalDiscountedPrice());
        createdOrder.setDiscounte(cart.getDiscounte());
        createdOrder.setTotalItem(cart.getTotalItem());
        createdOrder.setShippingAddress(address);
        createdOrder.setOrderDate(LocalDateTime.now());
        createdOrder.setOrderStatus(OrderStatus.PENDING);
        createdOrder.setPaymentMethod(shippAddress.getPaymentMethod());
        createdOrder.setCreatedAt(LocalDateTime.now());

        // Lưu Order và lấy lại Order đã lưu
        Order savedOrder = orderRepository.save(createdOrder);

        // Gán Order cho từng OrderItem và lưu chúng
        for (OrderItem orderItem : orderItems) {
            orderItem.setOrder(savedOrder);
            orderItemRepository.save(orderItem);
        }

        // Xóa từng CartItem trong giỏ hàng
        for (CartItem item : cart.getCartItems()) {
            Optional<CartItem> cartItemOpt = cartItemRepository.findById(item.getId());
            if (cartItemOpt.isPresent()) {
                cartItemRepository.deleteById(item.getId());
                log.info("Removed item {}", item.getId());
            } else {
                log.error("Cart item with id {} not found", item.getId());
            }
        }
        cart.setTotalItem(0);
        cart.setDiscounte(0);
        cart.setTotalDiscountedPrice(0);
        cart.setTotalPrice(0);
        cartRepository.save(cart);

        return savedOrder;
    }

    @Override
    public Order confirmedOrder(Long orderId) throws OrderException {
        Order order=findOrderById(orderId);
        order.setOrderStatus(OrderStatus.CONFIRMED);


        return orderRepository.save(order);
    }

    @Override
    public Order shippedOrder(Long orderId) throws OrderException {
        Order order=findOrderById(orderId);
        order.setOrderStatus(OrderStatus.SHIPPED);
        return orderRepository.save(order);
    }

    @Override
    public Order deliveredOrder(Long orderId) throws OrderException {
        Order order=findOrderById(orderId);
        order.setOrderStatus(OrderStatus.DELIVERED);
        return orderRepository.save(order);
    }

//    @Override
//    public Order cancledOrder(Long orderId) throws OrderException {
//        Order order=findOrderById(orderId);
//        order.setOrderStatus(OrderStatus.CANCELLED);
//        return orderRepository.save(order);
//    }
    @Override
    public Order cancledOrder(Long orderId) throws OrderException {
        Order order = findOrderById(orderId);

        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new OrderException("Đơn hàng đã bị hủy trước đó.");
        }
        // Hoàn lại số lượng sản phẩm
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            if (product != null) {
                product.setQuantity(product.getQuantity() + item.getQuantity());
                productRepository.save(product); // Cập nhật số lượng sản phẩm
            }
        }
        // Cập nhật trạng thái đơn hàng
        order.setOrderStatus(OrderStatus.CANCELLED);
        order.setCreatedAt(LocalDateTime.now()); // Cập nhật thời gian chỉnh sửa

        return orderRepository.save(order);
    }

    @Override
    public Order findOrderById(Long orderId) throws OrderException {
        Optional<Order> opt=orderRepository.findById(orderId);

        if(opt.isPresent()) {
            return opt.get();
        }
        throw new OrderException("order not exist with id "+orderId);
    }

    @Override
    public List<Order> usersOrderHistory(Long userId) {
        List<Order> orders = orderRepository.getUsersOrders(userId);

        // Sắp xếp danh sách theo thời gian tạo, giảm dần (mới nhất đến cũ nhất)
        return orders.stream()
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public Page<Order> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return orderRepository.findAll(pageable);
    }


    @Override
    public void deleteOrder(Long orderId) throws OrderException {
        Order order =findOrderById(orderId);

        orderRepository.deleteById(orderId);

    }
    @Override
    public Map<String, Double> getDailyRevenue(int month, int year) {
        LocalDateTime start = YearMonth.of(year, month).atDay(1).atStartOfDay();
        LocalDateTime end = start.plusMonths(1).minusSeconds(1);

        List<Object[]> results = orderRepository.getDailyRevenue(start, end);
        Map<String, Double> dailyRevenue = new HashMap<>();
        for (Object[] result : results) {
            int day = (int) result[0];
            double revenue = (double) result[1];
            dailyRevenue.put(String.valueOf(day), revenue);
        }
        return dailyRevenue;
    }
    @Override
    public Map<String, Double> getMonthlyRevenue(int year) {
        LocalDateTime start = Year.of(year).atDay(1).atStartOfDay();
        LocalDateTime end = start.plusYears(1).minusSeconds(1);

        List<Object[]> results = orderRepository.getMonthlyRevenue(start, end);
        Map<String, Double> monthlyRevenue = new HashMap<>();
        for (Object[] result : results) {
            int month = (int) result[0];
            double revenue = (double) result[1];
            monthlyRevenue.put(String.valueOf(month), revenue);
        }
        return monthlyRevenue;
    }
    @Override
    public Map<String, Double> getYearlyRevenue() {
        List<Object[]> results = orderRepository.getYearlyRevenue();
        Map<String, Double> yearlyRevenue = new HashMap<>();
        for (Object[] result : results) {
            int year = (int) result[0];
            double revenue = (double) result[1];
            yearlyRevenue.put(String.valueOf(year), revenue);
        }
        return yearlyRevenue;
    }

    @Override
    public List<RevenueByCategoryDTO> getRevenueByCategory() {
        return orderItemRepository.findRevenueByCategory();
    }

}
