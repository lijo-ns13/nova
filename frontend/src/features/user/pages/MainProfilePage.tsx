import { useAppSelector } from "../../../hooks/useAppSelector";
import { useParams } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import OtherUserProfilePage from "./OtherUserProfilePage";

function MainProfilePage() {
  const { username } = useAppSelector((state) => state.auth);
  const { username: routeUsername } = useParams<{ username: string }>();

  if (!username || !routeUsername) return <div>Loading...</div>;

  const isOwnProfile = username.toLowerCase() === routeUsername.toLowerCase();

  return isOwnProfile ? <ProfilePage /> : <OtherUserProfilePage />;
}

export default MainProfilePage;
