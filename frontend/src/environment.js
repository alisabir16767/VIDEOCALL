let IS_PROD = false;
const server = IS_PROD
  ? "https://videocall-backend-whia.onrender.com"
  : "http://localhost:8800";

export default server;
