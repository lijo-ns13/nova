import { useParams } from "react-router-dom";

import UserProfile from "../componets/viewableProfile/UserProfile";
function OtherUserProfilePage() {
  const { username: routeUsername } = useParams();

  return <>{routeUsername && <UserProfile username={routeUsername} />}</>;
}

export default OtherUserProfilePage;
