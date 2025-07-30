// src/lib/api/DoctorApi.ts
export interface Doctor {
  id: string;
  name: string;
  email: string;
  bio: string;
  specialization: string;
  experience: number;
  status: string;
  avatar?: string;
}

export interface DoctorCreateRequest {
  name: string;
  email: string;
  bio: string;
  specialization: string;
  experience: number;
  avatar?: File;
}

export interface DoctorUpdateRequest {
  name: string;
  email: string;
  bio: string;
  specialization: string;
  experience: number;
  avatar?: string | File;
}

export interface DoctorLoginRequest {
  email: string;
  password: string;
}

const API_BASE_URL = "https://localhost:7227/doctor";

// GET /doctors
export const getDoctorsPaged = async (pageIndex = 1, pageSize = 10) => {
  const res = await fetch(
    `${API_BASE_URL}/doctors?pageIndex=${pageIndex}&pageSize=${pageSize}`
  );

  if (!res.ok) throw new Error("Lỗi khi lấy danh sách bác sĩ");
  return res.json();
};

// GET /doctors/{id}
export const getDoctorById = async (id: string): Promise<Doctor> => {
  const res = await fetch(`${API_BASE_URL}/doctors/${id}`);
  if (!res.ok) throw new Error("Doctor not found");
  return res.json();
};

// POST /doctors
export const createDoctor = async (request: DoctorCreateRequest): Promise<Doctor> => {
  const formData = new FormData();
  Object.entries(request).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value as string | Blob);
    }
  });

  const res = await fetch(`${API_BASE_URL}/doctors`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to create doctor");
  return res.json();
};

// PUT /doctors/{id}
export const updateDoctor = async (id: string, request: DoctorUpdateRequest): Promise<void> => {
  const formData = new FormData();
  Object.entries(request).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value as string | Blob);
    }
  });

  const res = await fetch(`${API_BASE_URL}/doctors/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to update doctor");
};

// DELETE /doctors/{id}
export const deleteDoctor = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/doctors/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete doctor");
};

// GET /doctors/search?Name=abc&Specialty=xyz
export const searchDoctors = async (name?: string, specialty?: string): Promise<Doctor[]> => {
  const params = new URLSearchParams();
  if (name) params.append("Name", name);
  if (specialty) params.append("Specialty", specialty);

  const res = await fetch(`${API_BASE_URL}/doctors/search?${params.toString()}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
};

// POST /doctors/login
export const loginDoctor = async (request: DoctorLoginRequest): Promise<any> => {
  const res = await fetch(`${API_BASE_URL}/doctors/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
};
