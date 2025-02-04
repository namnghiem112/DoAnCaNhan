import React, { useState, useEffect } from "react";
import { Fab, IconButton, Tooltip } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChatIcon from "@mui/icons-material/Chat"; // Thay thế cho icon Zalo
import PhoneIcon from "@mui/icons-material/Phone";

const FloatingButtons = () => {
  const [showArrow, setShowArrow] = useState(false);

  // Lắng nghe sự kiện scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowArrow(true);
      } else {
        setShowArrow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-center space-y-4 z-50">
      {/* Nút gọi */}
      {showArrow && (
        <Tooltip title="Cuộn lên đầu" arrow>
          <Fab
            color="secondary"
            className="shadow-lg"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUpwardIcon />
          </Fab>
        </Tooltip>
      )}
      <Tooltip title="Gọi ngay" arrow>
        <Fab
          color="error"
          className="shadow-lg"
          href="tel:+84987654321" // Thay bằng số điện thoại của bạn
          aria-label="Call"
        >
          <PhoneIcon />
        </Fab>
      </Tooltip>

      {/* Nút Zalo */}
      <Tooltip title="Nhắn qua Zalo" arrow>
        <Fab
          color="primary"
          className="shadow-lg"
          href="https://zalo.me/0359430169"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Zalo"
        >
          <ChatIcon />
        </Fab>
      </Tooltip>
    </div>
  );
};

export default FloatingButtons;
