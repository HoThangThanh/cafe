import axios from "axios";

// 👉 thay baseURL = địa chỉ backend thật của bạn
export default axios.create({
    baseURL: "http://localhost:8080/api",
});
