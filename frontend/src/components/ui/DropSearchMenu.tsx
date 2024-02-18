import React, { useState } from "react";

interface User {
  name: string;
  photo: string;
}

const users: User[] = [
  { name: "John", photo: "john.jpg" },
  { name: "Jane", photo: "jane.jpg" },
  { name: "Bob", photo: "bob.jpg" },
];

const DropSearchMenu: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(inputValue.toLowerCase()),
    );
    setFilteredUsers(filtered);
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  return (
    <div className="w-[450px] ml-4 mr-4 border-3 border-[#6A6A6A] rounded-lg">
      <input
        className="w-full h-[30px]  rounded-lg"
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Search something here..."
      />
      {isActive && filteredUsers.length > 0 && (
        <ul
          style={{
            border: "2px solid black",
            padding: 0,
            margin: 0,
            listStyleType: "none",
          }}
        >
          {filteredUsers.map(user => (
            <li key={user.name}>
              <img src={user.photo} alt={user.name} />
              {user.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropSearchMenu;
