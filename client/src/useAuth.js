import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    axios
      .post("/login", {
        code,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);

        window.history.pushState({}, null, "/");
      })
      .catch((err) => {
        console.log("login error:", err);
        window.location = "/";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const timeinterval = setInterval(() => {
      axios
        .post("/refresh", {
          refreshToken,
        })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
          window.history.pushState({}, null, "/");
        })
        .catch((err) => {
          console.log("refresh error:", err);
          window.location = "/";
        });
    }, (expiresIn - 60) * 1000);
    return () => clearInterval(timeinterval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
