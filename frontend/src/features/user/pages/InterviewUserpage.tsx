// user/InterviewPage.tsx

import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useAppSelector";
import VideoCall from "../../shared/VideoCall";

const InterviewUserPage = () => {
  const { id: userId } = useAppSelector((state) => state.auth);
  const { roomId } = useParams();

  return (
    <div>
      <h1>User Interview Room</h1>
      {roomId && <VideoCall roomId={roomId} userId={userId} />}
    </div>
  );
};

export default InterviewUserPage;
