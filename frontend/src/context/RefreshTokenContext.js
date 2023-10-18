import { createContext, useContext, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { setToken, setUser } from "../features/auth/authSlice";

const RefreshTokenContext = createContext();

const RefreshTokenProvider = ({ children }) => {
  const dispatch = useDispatch();

  const currentToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    const currentRefreshToken = currentToken?.refresh;
    const refreshTokenInterval = 1000 * 60 * 50;

    if (currentToken) {
      const updateToken = async () => {
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            {
              refresh: currentRefreshToken,
            }
          );

          if (response.status === 200) {
            const newToken = response.data;
            const user = jwt_decode(newToken.access);

            dispatch(setToken(newToken));
            dispatch(setUser(user));
            localStorage.setItem("access", JSON.stringify(newToken));
            localStorage.setItem("user", JSON.stringify(user));
          }
        } catch (error) {
          console.log(error);
        }
      };
      const intervalId = setInterval(updateToken, refreshTokenInterval);

      return () => {
        clearInterval(intervalId);
      };
    } else {
      console.log("token not found");
    }
  }, [currentToken, dispatch]);

  return (
    <RefreshTokenContext.Provider value={{}}>
      {children}
    </RefreshTokenContext.Provider>
  );
};

export const useRefreshToken = () => useContext(RefreshTokenContext);

export default RefreshTokenProvider;
