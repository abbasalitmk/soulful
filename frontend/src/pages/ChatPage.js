import { useParams } from "react-router-dom";
import ChatRoom from "../components/Chat/ChatRoom";
import Followers from "../components/Chat/Followers";
import Navbar from "../components/Navbar/Navbar";

const ChatPage = () => {
  const { roomName } = useParams();
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <ChatRoom roomName={roomName} />
        </div>
      </div>
    </>
  );
};
export default ChatPage;
