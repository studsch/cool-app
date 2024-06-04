"use client";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCitiesByCountry } from "@/components/citiesbycountry";
import { getCountries } from "@/components/countries";

export default function EditProfile() {
  const [country, setCountry] = useState(""); // Состояние для выбранной страны
  const [city, setCity] = useState(""); // Состояние для выбранного города
  const [cities, setCities] = useState<string[]>([]); // Состояние для списка городов
  const { data: session, status, update } = useSession();
  const [firstName, setFirstName] = useState<string>(session?.user?.name || "");
  const [lastName, setLastName] = useState<string>(
    session?.user?.surname || "",
  );
  const [about, setAbout] = useState<string>(session?.user?.about || "");
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(
    `http://localhost:9000/${session?.user.avatar}` || null,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    setFirstName(session?.user?.name || "");
    setLastName(session?.user?.surname || "");
    setAbout(session?.user?.about || "");
    setAvatar(`http://localhost:9000/${session?.user.avatar}` || null);
    setCountry(session?.user?.country || "");
    setCity(session?.user?.city || "");
  }, [session]);

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry); // Устанавливаем выбранную страну

    // Если выбрана страна, загружаем список городов для этой страны
    if (selectedCountry) {
      const fetchedCities = getCitiesByCountry(selectedCountry); // Функция для получения списка городов по стране
      setCities(fetchedCities); // Устанавливаем список городов для выбранной страны
    } else {
      setCities([]); // Если страна не выбрана, очищаем список городов
    }
    setCity(""); // Очищаем выбранный город при изменении страны
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value); // Устанавливаем выбранный город
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result) {
          setAvatar(e.target.result);
        }
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    } else {
      setAvatar(null);
    }
  };

  const handleSaveProfile = async () => {
    if (status !== "authenticated" || !session?.user?.tokens.access) {
      console.log("Пользователь не авторизован или токен отсутствует");
      await signIn();
      return;
    }

    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile);
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/auth/avatar?bucket=avatars",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.user.tokens.access}`,
            },
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setAvatar(`http://localhost:9000/${result.filePath}`);
      } catch (error) {
        console.error("Failed to upload avatar.", error);
      }
    }

    const updatedSession = {
      ...session,
      user: {
        ...session.user,
        name: firstName,
        surname: lastName,
        about: about,
        image: avatar,
        city: city,
        country: country,
      },
    };

    await update(updatedSession);
    console.log("Profile updated successfully!");
    window.location.href = "http://localhost:3000/profilep";
  };
  console.log(session);
  return (
    <>
      <Card className="w-[600px] p-4 mt-5">
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Редактирование профиля</h2>
          <div>
            <h3 className="text-text-secondary-color font-bold mb-2">
              Редактирование аватара
            </h3>
            <img
              src={avatar as string}
              alt="Avatar"
              className="mb-4 w-24 h-24 rounded-full object-cover"
            />
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleAvatarChange}
              className="mb-4"
            />
          </div>
          <div>
            <h3 className="text-text-secondary-color font-bold mb-2">
              Редактирование информации о себе
            </h3>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              Имя
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="mt-1 p-2 block w-full border-[1px] border-[#6A6A6A] rounded-lg"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Фамилия
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="mt-1 p-2 block w-full border-[1px] border-[#6A6A6A] rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="about"
              className="block text-sm font-medium text-gray-700"
            >
              О себе
            </label>
            <textarea
              id="about"
              value={about}
              onChange={e => setAbout(e.target.value)}
              className="mt-1 p-2 block w-full border-[1px] border-[#6A6A6A] rounded-lg overflow-hidden"
            />
          </div>
          <div>
            <h4 className="text-text-secondary-color font-bold mb-2 mt-2">
              Редактирование профиля
            </h4>
            <div>
              <label htmlFor="country">Страна:</label>
              <input
                id="country"
                type="text"
                value={country}
                onChange={handleCountryChange}
                autoComplete="on"
                list="countries"
                className="mt-1 p-2 block border-[1px] border-[#6A6A6A] rounded-lg"
              />
              <datalist id="countries">
                {getCountries().map((countryName, index) => (
                  <option key={index} value={countryName} />
                ))}
              </datalist>
            </div>
            <div>
              <label htmlFor="city">Город:</label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={handleCityChange}
                autoComplete="on"
                list="cities"
                disabled={!country}
                className="mt-1 p-2 block border-[1px] border-[#6A6A6A] rounded-lg"
              />
              <datalist id="cities">
                {cities.map((cityName, index) => (
                  <option key={index} value={cityName} />
                ))}
              </datalist>
            </div>
          </div>
          <Button
            onClick={handleSaveProfile}
            className=" text-white px-3 py-1 rounded-md mt-4"
          >
            Сохранить
          </Button>
        </div>
      </Card>
    </>
  );
}
