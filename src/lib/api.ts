// src/lib/api.ts
const AUTH_API = import.meta.env.VITE_AUTH_API;
const APPOINTMENT_API = import.meta.env.VITE_APPOINTMENT_API;
const NOTIFICATION_API = import.meta.env.VITE_NOTIFICATION_API;
const DOCTOR_API = import.meta.env.VITE_DOCTOR_API;
const GATEWAY_API = import.meta.env.VITE_GATEWAY_API;


export async function login(email: string, password: string) {
  const res = await fetch(`${AUTH_API}/User/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.message || 'Login failed');
  }

  return res.json(); // nên trả về { token: '...' }
}

export const getAllDoctors = async () => {
  const res = await fetch(`${DOCTOR_API}/doctors`);
  if (!res.ok) {
    throw new Error("Không thể tải danh sách bác sĩ");
  }
  return res.json();
};
export const getAvailableSlots = async (doctorId: string, date: string) => {
  const url = `${GATEWAY_API}/api/GatewaySlots?doctorId=${doctorId}&date=${date}`;
  console.log("👉 Fetching slots from:", url);
  const res = await fetch(url);

  console.log("👉 Response status:", res.status);

  const data = await res.json();
  console.log("👉 Slots data:", data);

  if (!res.ok) {
    throw new Error("Không thể tải danh sách lịch hẹn");
  }

  if (!data.slots) {
    throw new Error("Không có dữ liệu khung giờ");
  }

  return data.slots;
};


export const bookSlot = async (slotId: string, patientId: string) => {
  const res = await fetch(`${GATEWAY_API}/api/GatewaySlots/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ slotId, patientId })
  });

  if (!res.ok) {
    const text = await res.text(); // tránh lỗi parse JSON nếu lỗi trả về không đúng format
    console.error("❌ Booking API error:", text);
    throw new Error(`Lỗi đặt lịch: ${text}`);
  }

  try {
    const data = await res.json();
    console.log("📦 bookSlot response:", data);
    return data;
  } catch (err) {
    throw new Error("Không thể phân tích phản hồi từ server");
  }
};

export const getAppointmentHistory = async (patientId: string) => {
  const res = await fetch(`${GATEWAY_API}/api/GatewaySlots/history?patientId=${patientId}`);
  if (!res.ok) throw new Error("Không thể lấy lịch sử khám");
  const data = await res.json();
  return data.slots; // trả về danh sách BookedTimeSlotDetail
};


