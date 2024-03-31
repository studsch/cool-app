import React from "react";

interface Friend {
  id: number;
  name: string;
  lastName: string;
}

interface UserWidgetProps {
  userPhoto: string;
  userName: string;
  userLastName: string;
  friends: Friend[];
}

const UserWidget: React.FC<UserWidgetProps> = ({
  userPhoto,
  userName,
  userLastName,
  friends,
}) => {
  return (
    <div className="bg-white rounded-lg w-[300px]">
      <div className="user-info">
        <img src={userPhoto} alt="User" className="user-photo" />
        <div className="user-name">{`${userName} ${userLastName}`}</div>
      </div>
      <div className="friends-list">
        <h2>Friends</h2>
        <ul>
          {friends.map(friend => (
            <li key={friend.id}>
              {friend.name} {friend.lastName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserWidget;
