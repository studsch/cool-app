import React, { useState } from "react";
import { UserPlus } from "lucide-react";

interface User {
  name: string;
  login: string;
  subs: number;
  descript: string;
  photo: string;
  postphoto: string;
}

const users: User[] = [
  {
    name: "Egor",
    login: "egorik",
    subs: 17236,
    descript: "Тут  я короче новый видос выложил, посмотрите скорее",
    photo:
      "https://i.pinimg.com/736x/c4/8a/d1/c48ad114b60a8272b3c71ec344f1f257.jpg",
    postphoto: "https://i.ytimg.com/vi/m21oDX0cVA8/maxresdefault.jpg",
  },
  {
    name: "Cheburasha",
    login: "chebupelya",
    subs: 27468,
    descript: "Гена опять мне мешает",
    photo:
      "https://www.meme-arsenal.com/memes/1cd36d68c1df18a52f31c882a2e22236.jpg",
    postphoto:
      "https://celes.club/uploads/posts/2022-06/1654647342_41-celes-club-p-cheburashka-oboi-krasivie-46.jpg",
  },
  {
    name: "Vinny",
    login: "vinny",
    subs: 1827498,
    descript: "Иду воровать мед",
    photo:
      "https://pictures.pibig.info/uploads/posts/2023-04/1681504701_pictures-pibig-info-p-risunok-vinipukha-vkontakte-54.jpg",
    postphoto:
      "https://domashniirestoran.ru/wp-content/uploads/2023/11/44410de14a23eb1a1ce226384816e9be-1.jpg",
  },
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
        <ul className="absolute mt-4 z-10 bg-white border-2 border-gray-300 rounded-lg shadow-md">
          {/* Recent */}
          <li className=" p-2">
            <strong>Recent:</strong>
            {users.map((user, index) => (
              <div className="flex flex-row">
                <div key={index} className="flex flex-col">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-[65px] h-[65px] rounded-full mr-2 content-center"
                  />
                  <span className="w-[65px] text-center">@{user.login}</span>
                </div>
              </div>
            ))}
          </li>
          {/* People */}
          <li className=" p-2">
            <strong>People:</strong>
            {users.map((user, index) => (
              <div key={index} className="flex items-center w-full">
                <div className="flex justify-self-start">
                  <div className="">
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-[45px] h-[45px] rounded-full mb-2 mt-2 mr-2"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="ml-2">{user.subs} followers</span>
                  </div>
                </div>
                <div className="justify-items-end">
                  <UserPlus />
                </div>
              </div>
            ))}
          </li>
          {/* Photo */}
          <li className=" p-2 mt-2 mb-2">
            <strong>Photo:</strong>
            {users.map((user, index) => (
              <div key={index} className="flex items-center">
                <img
                  src={user.postphoto}
                  alt={user.name}
                  className="w-[64px] h-[65px] mr-2 mb-2 mt-2 rounded-lg"
                />
                <div className="flex flex-col">
                  <span>{user.name}</span>
                  <p className="ml-2 w-[400px] truncate">{user.descript}</p>
                </div>
                <div>
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-[35px] h-[35px] rounded-full mb-2 mt-2 mr-2"
                  />
                </div>
              </div>
            ))}
          </li>
        </ul>
      )}
    </div>
  );
};

export default DropSearchMenu;
