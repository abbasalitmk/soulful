import { useParams } from "react-router-dom";
import ChatRoom from "../components/Chat/ChatRoom";
import Navbar from "../components/Navbar/Navbar";

const ChatPage = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <ChatRoom />
        </div>
      </div>
    </>
  );
};
export default ChatPage;
