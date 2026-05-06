import axios from "axios";

const BASE = "http://localhost:8000";

// Create an Axios instance with default config
const api = axios.create({
  baseURL: BASE,
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────
export const signup = (data) =>
  api.post("/auth/signup", data).then(res => res.data);

export const login = (data) =>
  api.post("/auth/login", data).then(res => res.data);

export const getCurrentUser = () =>
  api.get("/auth/me").then(res => res.data);

// ── Symptoms ──────────────────────────────────────────────────────────────────
export const predictSymptoms = (symptoms, region, city) =>
  api.post("/symptoms", { symptoms, region, city }).then(res => res.data);

export const listAllSymptoms = () =>
  api.get("/symptoms/list").then(res => res.data);

// ── Risk ──────────────────────────────────────────────────────────────────────
export const getRisk = (symptoms, disease, region) =>
  api.post("/risk", { symptoms, disease, region }).then(res => res.data);

// ── Doctors ───────────────────────────────────────────────────────────────────
export const getDoctors = (specialization, city) => {
  const params = {};
  if (specialization) params.specialization = specialization;
  if (city) params.city = city;
  return api.get("/doctors", { params }).then(res => res.data);
};

// ── Report ────────────────────────────────────────────────────────────────────
export const analyzeReportFile = (file) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/report", form, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then(res => res.data);
};

export const analyzeReportText = (text) =>
  api.post("/report/text", { text }).then(res => res.data);

// ── Outbreaks ─────────────────────────────────────────────────────────────────
export const getOutbreaks = (region) => {
  const params = region ? { region } : {};
  return api.get("/outbreaks", { params }).then(res => res.data);
};

export const matchOutbreaks = (symptoms, region) =>
  api.post("/outbreaks/match", { symptoms, region }).then(res => res.data);
