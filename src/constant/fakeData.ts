import { TripPlan } from '../types/types';

export const fakeTripPlan: TripPlan = {
    summary: "Chuyến đi 3 ngày 2 đêm tuyệt vời tại Đà Nẵng, khám phá vẻ đẹp của biển Mỹ Khê, Ngũ Hành Sơn và phố cổ Hội An.",
    tips: "Nên mang theo kem chống nắng, mũ nón và giày đi bộ thoải mái. Đặt vé máy bay và khách sạn sớm để có giá tốt.",
    stats: {
        totalCost: 5000000,
        currency: "VND",
        totalEvents: 12,
        weatherSummary: "Nắng đẹp, nhiệt độ trung bình 28-32 độ C",
        durationDays: 3
    },
    itinerary: [
        {
            day: 1,
            date: "2023-11-24",
            theme: "Khám phá thành phố biển",
            events: [
                {
                    id: "evt_1",
                    time: "08:00",
                    endTime: "09:00",
                    activity: "Ăn sáng",
                    locationName: "Mì Quảng Bà Mua",
                    address: "19-21 Trần Bình Trọng, Hải Châu, Đà Nẵng",
                    description: "Thưởng thức món mì Quảng đặc sản Đà Nẵng.",
                    costEstimate: 50000,
                    currency: "VND",
                    transportMethod: "Taxi",
                    transportDuration: "15 mins",
                    status: "accepted",
                    type: "food"
                },
                {
                    id: "evt_2",
                    time: "09:30",
                    endTime: "11:30",
                    activity: "Tham quan",
                    locationName: "Bảo tàng Điêu khắc Chăm",
                    address: "Số 02 2 Tháng 9, Bình Hiên, Hải Châu, Đà Nẵng",
                    description: "Tìm hiểu về văn hóa Chăm Pa cổ đại.",
                    costEstimate: 60000,
                    currency: "VND",
                    transportMethod: "Taxi",
                    transportDuration: "10 mins",
                    status: "accepted",
                    type: "activity"
                },
                {
                    id: "evt_3",
                    time: "12:00",
                    endTime: "13:30",
                    activity: "Ăn trưa",
                    locationName: "Cơm Niêu Nhà Đỏ",
                    address: "176 Nguyễn Tri Phương, Thanh Khê, Đà Nẵng",
                    description: "Bữa trưa truyền thống với cơm niêu.",
                    costEstimate: 150000,
                    currency: "VND",
                    transportMethod: "Taxi",
                    transportDuration: "10 mins",
                    status: "accepted",
                    type: "food"
                },
                {
                    id: "evt_4",
                    time: "14:00",
                    endTime: "17:00",
                    activity: "Tắm biển",
                    locationName: "Biển Mỹ Khê",
                    address: "Phước Mỹ, Sơn Trà, Đà Nẵng",
                    description: "Thư giãn và tắm biển tại một trong những bãi biển đẹp nhất hành tinh.",
                    costEstimate: 0,
                    currency: "VND",
                    transportMethod: "Taxi",
                    transportDuration: "15 mins",
                    status: "accepted",
                    type: "activity"
                }
            ]
        },
        {
            day: 2,
            date: "2023-11-25",
            theme: "Hội An cổ kính",
            events: [
                {
                    id: "evt_5",
                    time: "08:00",
                    endTime: "12:00",
                    activity: "Tham quan",
                    locationName: "Ngũ Hành Sơn",
                    address: "81 Huyền Trân Công Chúa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng",
                    description: "Khám phá hệ thống hang động và chùa chiền trên núi.",
                    costEstimate: 40000,
                    currency: "VND",
                    transportMethod: "Taxi",
                    transportDuration: "20 mins",
                    status: "accepted",
                    type: "activity"
                },
                {
                    id: "evt_6",
                    time: "13:00",
                    endTime: "14:00",
                    activity: "Ăn trưa",
                    locationName: "Bánh Mì Phượng",
                    address: "2B Phan Châu Trinh, Cẩm Châu, Hội An, Quảng Nam",
                    description: "Thưởng thức bánh mì nổi tiếng thế giới.",
                    costEstimate: 30000,
                    currency: "VND",
                    transportMethod: "Bus",
                    transportDuration: "45 mins",
                    status: "accepted",
                    type: "food"
                },
                {
                    id: "evt_7",
                    time: "15:00",
                    endTime: "21:00",
                    activity: "Tham quan",
                    locationName: "Phố Cổ Hội An",
                    address: "Phường Minh An, Hội An, Quảng Nam",
                    description: "Dạo quanh phố cổ, thả đèn hoa đăng.",
                    costEstimate: 120000,
                    currency: "VND",
                    transportMethod: "Walk",
                    transportDuration: "5 mins",
                    status: "accepted",
                    type: "activity"
                }
            ]
        },
        {
            day: 3,
            date: "2023-11-26",
            theme: "Bà Nà Hills",
            events: [
                {
                    id: "evt_8",
                    time: "08:00",
                    endTime: "16:00",
                    activity: "Tham quan",
                    locationName: "Bà Nà Hills",
                    address: "Hòa Ninh, Hòa Vang, Đà Nẵng",
                    description: "Trải nghiệm cáp treo, Cầu Vàng và Làng Pháp.",
                    costEstimate: 900000,
                    currency: "VND",
                    transportMethod: "Shuttle Bus",
                    transportDuration: "60 mins",
                    status: "accepted",
                    type: "activity"
                }
            ]
        }
    ]
};
