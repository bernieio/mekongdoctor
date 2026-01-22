export interface SalinityPoint {
    id: string;
    name: string;
    lat: number;
    lng: number;
    salinity: number;
    status: "safe" | "warning" | "danger";
    updatedAt: string;
}

export const salinityData: SalinityPoint[] = [
    // Cửa sông & Ven biển (Nguy cơ cao)
    { id: "1", name: "Cửa Tiểu (Tiền Giang)", lat: 10.2167, lng: 106.7333, salinity: 8.5, status: "danger", updatedAt: "2024-01-20T08:00:00Z" },
    { id: "2", name: "Cửa Đại (Bến Tre)", lat: 10.2500, lng: 106.6833, salinity: 6.2, status: "warning", updatedAt: "2024-01-20T08:00:00Z" },
    { id: "6", name: "Gành Hào (Bạc Liêu)", lat: 9.2833, lng: 105.7167, salinity: 7.8, status: "danger", updatedAt: "2024-01-20T08:00:00Z" },
    { id: "7", name: "Sông Đốc (Cà Mau)", lat: 9.1769, lng: 105.1500, salinity: 9.2, status: "danger", updatedAt: "2024-01-20T08:00:00Z" },

    // Nội đồng (Nguy cơ trung bình/thấp)
    { id: "3", name: "Châu Thành (Bến Tre)", lat: 10.2417, lng: 106.3750, salinity: 4.1, status: "warning", updatedAt: "2024-01-20T08:00:00Z" },
    { id: "4", name: "Cầu Ngang (Trà Vinh)", lat: 9.9347, lng: 106.3422, salinity: 2.8, status: "safe", updatedAt: "2024-01-20T08:00:00Z" },
    { id: "5", name: "Mỹ Xuyên (Sóc Trăng)", lat: 9.6033, lng: 105.9800, salinity: 5.5, status: "warning", updatedAt: "2024-01-20T08:00:00Z" },
    { id: "8", name: "An Biên (Kiên Giang)", lat: 10.0125, lng: 105.0809, salinity: 3.5, status: "safe", updatedAt: "2024-01-20T08:00:00Z" },

    // Các điểm bổ sung (Page 3+)
    { id: "9", name: "Vị Thanh (Hậu Giang)", lat: 9.7578, lng: 105.6414, salinity: 1.8, status: "safe", updatedAt: "2024-01-20T08:00:00Z" },
    { id: "10", name: "Vũng Liêm (Vĩnh Long)", lat: 10.1139, lng: 106.1922, salinity: 2.2, status: "safe", updatedAt: "2024-01-20T08:00:00Z" },
    { id: "11", name: "Trần Đề (Sóc Trăng)", lat: 9.5312, lng: 106.1833, salinity: 7.1, status: "danger", updatedAt: "2024-01-20T08:00:00Z" },
    { id: "12", name: "Duyên Hải (Trà Vinh)", lat: 9.6644, lng: 106.4950, salinity: 6.8, status: "warning", updatedAt: "2024-01-20T08:00:00Z" },
];

export const getStatus = (level: number): "safe" | "warning" | "danger" => {
    if (level > 7) return "danger";
    if (level >= 4) return "warning";
    return "safe";
};
