// App.js
import React, { useState } from "react";
import UserList from "./UserList";
import Chat from "./Chat";

function Chatpage() {
  const [receiver, setReceiver] = useState(null);

  const handleUserClick = (user) => {
    setReceiver(user);
  };

  return (
    <div>
      <UserList followedUsers={followedUsers} onUserClick={handleUserClick} />
      {receiver && <Chat user={user} receiver={receiver} />}
    </div>
  );
}

export default Chatpage;
