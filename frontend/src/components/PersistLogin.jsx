import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const PersistLogin = () => {
  const [isloading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        navigate("/");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (!accessToken || !user) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, [accessToken, user, refresh, navigate]);

  return (
    <React.Fragment>
      {isloading ? (
        <div className="w-full flex justify-center items-center py-12">
          <Spinner size="large" />
        </div>
      ) : (
        <Outlet />
      )}
    </React.Fragment>
  );
};

export default PersistLogin;
