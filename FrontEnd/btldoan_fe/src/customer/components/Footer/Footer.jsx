import { CgMail } from "react-icons/cg";
import { CiPhone } from "react-icons/ci";
import { FaFacebook, FaInstagram, FaPhoneAlt } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
const Footer = () => {
  return (
    <div className="bg-[#f1f1f1] py-10">
      <div className="w-full grid grid-cols-12 gap-4 px-4">
        {/* Thông tin liên hệ */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 p-4">
          <div className="flex flex-col items-start justify-center">
            <h3 className="text-2xl font-medium text-black mb-4">
              Thông tin liên hệ
            </h3>
            <img
              src="/logo_samishop.png"
              alt="Logo"
              className="h-[120px] object-cover mb-4"
            />
            <p className="text-base font-medium text-gray-700 mb-4 text-left">
              Công ty TNHH Bán lẻ SammiShop
            </p>
            <p className="text-base font-medium text-gray-700 m-0 mb-4 text-left">
              SammiShop là chuỗi siêu thị mỹ phẩm chính hãng, giá rẻ, đáng tin
              cậy dành cho giới trẻ Việt Nam.
            </p>
            <p className="text-base font-medium text-gray-700 mb-4 text-left">
              Địa chỉ: Số 159 đường Xuân Thủy, phường Dịch Vọng Hậu, Quận Cầu
              Giấy, Hà Nội
            </p>
            <div className="flex justify-center items-center">
              <CiPhone className="inline text-2xl" />
              <p className="text-base font-medium text-gray-700 text-left">
                Số điện thoại: 19002631
              </p>
            </div>
            <div className="flex justify-center items-center">
              <CgMail className="inline text-2xl" />
              <p className="text-base font-medium text-gray-700 text-left">
                Email: cskh@sammiShop.com
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-8 space-x-4">
            <a
              href="https://www.facebook.com/namnghiem23.5"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3b5998] hover:text-[#e82e4d]"
            >
              <FaFacebook size={40} />
            </a>
            <a
              href="https://www.instagram.com/nghiemnam235"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C13584] hover:text-[#e82e4d]"
            >
              <FaInstagram size={40} />
            </a>
            <a
              href="https://zalo.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1C75BC] hover:text-[#e82e4d]"
            >
              <SiZalo size={40} />
            </a>
          </div>
        </div>
        {/* Về chúng tôi */}
        <div className="flex flex-col col-span-12 sm:col-span-6 lg:col-span-2 p-4">
          <h3 className="text-2xl font-medium text-black mb-4 text-left">
            Về chúng tôi
          </h3>
          <ul className="text-base font-medium text-gray-700 text-left">
            <li className="mb-2">Câu chuyện thương hiệu</li>
            <li className="mb-2">Điều khoản dịch vụ</li>
            <li className="mb-2">Tuyển dụng</li>
            <li className="mb-2">Hệ thống cửa hàng</li>
            <li className="mb-2">Chứng nhận đại lý chính hãng</li>
          </ul>
        </div>

        {/* Chính sách */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 p-4">
          <h3 className="text-2xl font-medium text-black mb-4 text-left">
            Chính sách
          </h3>
          <ul className="text-base font-medium text-gray-700 text-left">
            <li className="mb-2">Hướng dẫn mua hàng</li>
            <li className="mb-2">Quy định và hình thức thanh toán</li>
            <li className="mb-2">Chính sách giao hàng</li>
            <li className="mb-2">Chính sách đổi trả</li>
            <li className="mb-2">Chính sách tích lũy điểm</li>
            <li className="mb-2">Chính sách bảo mật thông tin</li>
            <li className="mb-2">Giao hàng siêu tốc 1H</li>
          </ul>
        </div>

        {/* Đăng ký nhận tin và phương thức thanh toán */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 p-4">
          <h3 className="text-2xl font-medium text-black mb-4 text-left">
            Đăng ký nhận tin
          </h3>
          <div className="flex items-center mb-4 w-full h-10">
            <input
              type="email"
              placeholder="Nhập địa chỉ email"
              className="p-2 w-[70%] border-gray-300 rounded-l-lg outline-none focus:border-white"
            />
            <button className="bg-[#e82e4d] text-white rounded-r-lg h-full w-[30%]">
              Đăng ký
            </button>
          </div>

          <h3 className="text-2xl font-medium text-black mb-4 text-left">
            Phương thức thanh toán
          </h3>
          <div className="flex space-x-2">
            {/* Phương thức thanh toán */}
            <img src="/visa.png" alt="Visa" className="w-10" />
            <img src="/mastercard.png" alt="Mastercard" className="w-10" />
            <img src="/jcb.png" alt="VNPay" className="w-10" />
            <img src="/vnpay.png" alt="VNPay" className="w-10" />
            <img src="/momo.png" alt="Momo" className="w-10" />
          </div>

          {/* Đăng ký App */}
          <div className="mt-6">
            <h3 className="text-2xl font-medium text-black mb-2 text-left">
              Tải ngay App SammiShop
            </h3>
            <div className="flex space-x-2">
              <img src="/appstore.png" alt="App Store" className="w-32" />
              <img src="/googleplay.png" alt="Google Play" className="w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
