// company/InterviewPage.tsx

import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useAppSelector";
import VideoCall from "../../shared/VideoCall";

const InterviewCompanyPage = () => {
  const { id: comanyId } = useAppSelector((state) => state.auth);
  const { roomId } = useParams();

  return (
    <div>
      <h1>Company Interview Room</h1>
      {roomId && <VideoCall userId={comanyId} roomId={roomId} />}
    </div>
  );
};

export default InterviewCompanyPage;
