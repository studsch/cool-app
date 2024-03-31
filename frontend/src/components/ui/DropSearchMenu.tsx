import React, { useState, useEffect, useRef } from "react";
import { Input } from "./input";
import People from "../people/people";
import { Recent } from "../recent/recent";
import Post from "../postsearch/postsearch";

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

  const dropdownRef = useRef<HTMLUListElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(inputValue.toLowerCase()),
    );
    setFilteredUsers(filtered);
    setIsActive(!!inputValue && filtered.length > 0);
    // Появление по вводу и наличии результатов
  };

  const handlePostClick = (name: string) => {
    // Обработка клика по элементу Post
    console.log(`Post clicked: ${name}`);
  };

  return (
    <div className="w-[450px] ml-4 mr-4 border-[1px] border-[#6A6A6A] rounded-lg">
      <Input
        className="w-full h-[30px]  rounded-lg focus:outline-none"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search something here..."
      />
      {isActive && filteredUsers.length > 0 && (
        <ul
          ref={dropdownRef}
          className="absolute mt-4 z-10 bg-white border-2 border-gray-300 rounded-lg shadow-md"
        >
          {/* Recent */}
          <Recent />
          {/* People */}
          <People />
          {/* Photo */}
          <div className="mx-4 mb-6">
            <p className="text-lg font-medium text-text-primary-color my-4">
              Posts
            </p>
          </div>
          {users.slice(0, 3).map(user => (
            <Post
              key={user.login}
              photo={user.postphoto}
              name={user.name}
              text={user.descript}
              avatarImg={user.photo}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropSearchMenu;
