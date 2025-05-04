import React from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useParams } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import OtherUserProfilePage from "./OtherUserProfilePage";
function MainProfilePage() {
  const { username } = useAppSelector((state) => state.auth);
  const { username: routeUsername } = useParams();
  console.log(routeUsername, "kslf");
  return (
    <>
      {username && routeUsername && username == routeUsername ? (
        <ProfilePage />
      ) : (
        <OtherUserProfilePage />
      )}
    </>
  );
}

export default MainProfilePage;
