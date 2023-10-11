import axios from "axios";
import { useSelector } from "react-redux";
import config from "./config";

const AxiosInstance = () => {
  const authToken = useSelector((state) => state.auth.token);

  const axiosInstance = axios.create({
    baseURL: config.axios_url,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.access}`,
    },
  });

  return axiosInstance;
};

export default AxiosInstance;
