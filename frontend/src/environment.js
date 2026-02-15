const IS_PROD = import.meta.env.PROD;

const server = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL
  : IS_PROD
  ? "https://videocall-backend-whia.onrender.com"
  : "http://localhost:8800";

export default server;

