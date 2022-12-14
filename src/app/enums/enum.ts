export enum RoleTitle {
  'Admin' = -1,
  'Quản lý cục bộ', LocalManager = 1,
  'Quản lý dịch vụ', ServiceManager = 2,
  'Quản lý tour', TourManager = 3,
  'Quản lý tour booking', TourBookingManager = 4,
  'Hướng dẫn viên', TourGuide = 5,
  'Hỗ trợ viên', Supporter = 6
}

export enum StatusBooking {
  'Đã thanh toán',
  'Chưa thanh toán',
}

enum ApprovalStatus {
  'Đã duyệt',
  'Chưa duyệt',
  'Từ chối'
};

export enum StatusBooking
{
    "Đã huỷ và đang chờ hoàn tiền" = -2, // Pending warning
    "Đã hoàn tiền" = -1, // Refunded success

    "Đã đặt tour nhưng chưa thanh toán" = 1, // Paying waning
    "Đã đặt tour và có đặt cọc" = 2, // Deposit waning

    "Đã thanh toán hết" = 3, //  Paid info
    "Hủy tour" = 4, // Cancel danger
    "Tour đã hoàn thành" = 5, // Finished success

}

export enum StatusNotification
{
    Success = "Success",
    Error = "Error",
    Warning = "Warning",
    Info = "Info",
    Block = "Block",
    Validation = "Validation"
}


export enum PaymentMethod
{
    Cash = 1,
    Card = 2,
    Paypal = 3,
    Vnpay = 4,
}
