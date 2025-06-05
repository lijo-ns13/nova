import { Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { logout } from "../../auth/auth.slice";
import { logOut } from "../../user/services/AuthServices";
import socket from "../../../socket/socket";
// import { setUnreadCount } from "../../../store/slice/notificationSlice";
// import { useEffect, useState } from "react";
// import { useAppSelector } from "../../../hooks/useAppSelector";
// import companyAxios from "../../../utils/companyAxios";
// import toast from "react-hot-toast";
// import userAxios from "../../../utils/userAxios";

const Navbar = () => {
  const dispatch = useAppDispatch();
  // const { unreadCount } = useAppSelector((state) => state.notification);

  // const fetchUnreadCountFn = async () => {
  //   const res = await companyAxios.get(
  //     "http://localhost:3000/notification/unread-count",
  //     {
  //       withCredentials: true,
  //     }
  //   );
  //   dispatch(setUnreadCount(res.data.count));
  //   console.log("ressy", res);
  //   return res;
  // };
  // useEffect(() => {
  //   // Initial fetch
  //   fetchUnreadCountFn();

  //   // Listen to real-time updates
  //   socket.on("unreadCountUpdate", (data: { count: number }) => {
  //     dispatch(setUnreadCount(data.count));
  //   });

  //   socket.on("newNotification", (notification) => {
  //     const { type, content } = notification;

  //     let message = "";

  //     switch (type) {
  //       case "FOLLOW":
  //         message = `👤 ${content}`; // e.g., "siyad followed you"
  //         break;
  //       case "JOB":
  //         message = `💼 ${content}`; // e.g., "New job posted"
  //         break;
  //       case "POST":
  //         message = `📝 ${content}`; // e.g., "New post from XYZ"
  //         break;
  //       case "COMMENT":
  //         message = `💬 ${content}`; // e.g., "XYZ commented on your post"
  //         break;
  //       case "LIKE":
  //         message = `❤️ ${content}`; // e.g., "XYZ liked your post"
  //         break;
  //       case "MESSAGE":
  //         message = `📩 ${content}`; // e.g., "New message from XYZ"
  //         break;
  //       case "GENERAL":
  //         message = `🔔 ${content}`; // General purpose
  //         break;
  //       default:
  //         message = `🔔 ${content}`;
  //     }

  //     toast(message);
  //     console.log("New notification received:", notification);
  //   });

  //   return () => {
  //     // Clean up listeners on unmount
  //     socket.off("unreadCountUpdate");
  //     socket.off("newNotification");
  //   };
  // }, []);

  async function handleLogout() {
    await logOut();
    socket.disconnect();
    dispatch(logout());
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="w-full px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Company Logo */}
          <div>
            <Link to="/dashboard" className="flex items-center">
              <span className="font-bold text-xl text-gray-800">NOVA</span>
              {/* <span className="font-bold text-xl text-gray-800">
                {unreadCount}
              </span> */}
            </Link>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-gray-200 font-medium text-gray-700 rounded hover:bg-gray-300 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
