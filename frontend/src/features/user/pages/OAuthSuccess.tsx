import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { login } from "../../auth/auth.slice";

import axios from "axios";
import socket from "../../../socket/socket";
const OAuthSuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/me", {
          withCredentials: true,
        });
        const { name, email, role, user } = res.data;
        console.log("me res data", res.data);
        dispatch(
          login({
            name: name, // Ensure these fields are returned by SignInUser
            email: email,
            role: role,
            profilePicture: user.profilePicture, // Adjust based on your API response,
            isVerified: user.isVerified,
            isBlocked: user.isBlocked,
            id: user._id,
            headline: user.headline,
            username: user.username,
          })
        );
        if (!socket.connected) {
          socket.connect();
          socket.emit("login", user._id);
        }
        navigate("/feed");
      } catch (error) {
        console.error("Auth failed", error);
        navigate("/login");
      }
    };

    getUserInfo();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 text-lg">Logging you in...</p>
    </div>
  );
};

export default OAuthSuccessPage;
