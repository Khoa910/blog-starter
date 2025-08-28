import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Nếu navbar fixed, bạn có thể cộng thêm offset, ví dụ 80px
    window.scrollTo({
      top: 0, // hoặc top: 80 nếu navbar height 80px
      behavior: "smooth" // 'auto' nếu muốn nhảy ngay
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
