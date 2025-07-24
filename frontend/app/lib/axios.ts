import axios from 'axios';

const BASE_URL = '/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    //   console.log('Authorization header set:', config.headers['Authorization']);
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // session expired or unauthorized
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export const fetchCurrentUser = async () => {
  const response = await axiosInstance.get('/users/me');
  console.log('Fetched current user:', response.data);
  return {
    name: response.data.username, // Spójna nazwa
    email: response.data.email, // Spójna nazwa
    role: response.data.role,
  };
};

export default axiosInstance;