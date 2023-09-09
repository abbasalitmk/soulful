import React from "react";

const UserList = ({ users }) => {
  return (
    <div className="user-list">
      <h2>Followed Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
