"use client";
import { useSession, signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { Card } from "@/components/ui/card";

export default function EditProfile() {
  const { data: session } = useSession();
  const [firstName, setFirstName] = useState<string>(session?.user?.name || "");
  const [lastName, setLastName] = useState<string>(
    session?.user?.surname || "",
  );
  const [about, setAbout] = useState<string>(session?.user?.about || "");

  const handleSaveProfile = async () => {
    if (!session) {
      await signIn();
      return;
    }

    const updatedSession = {
      ...session,
      user: {
        ...session.user,
        name: firstName,
        surname: lastName,
        about: about,
      },
    };

    const currentSession = await getSession();
    Object.assign(session, updatedSession);

    console.log("Profile updated successfully!");
    console.log(session.user.name);
    console.log(session);
  };

  return (
    <>
      <Card className="w-[600px] p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Редактирование профиля</h2>
          <div className="mb-2">
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
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <button
            onClick={handleSaveProfile}
            className="bg-blue-500 text-white px-3 py-1 rounded-md mt-4"
          >
            Сохранить
          </button>
        </div>
      </Card>
    </>
  );
}

async function updateSession(session: {
  user: {
    name: string;
    surname: string;
    about: string;
    id: string;
    login: string;
    phone: string;
    date_of_birth: string;
    gender: string;
    created_at: string;
    updated_at: string;
    user_role: string;
    deleted: string;
    tokens: { access: string; refresh: string } & {
      access: string;
      refresh: string;
    };
    error: boolean | undefined;
    msg: string | undefined;
    avatar: string | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
  token: {
    id: string;
    login: string;
    phone: string;
    name: string;
    surname: string;
    about: string | undefined;
    avatar: string | undefined;
    date_of_birth: string;
    gender: string;
    created_at: string;
    updated_at: string;
    tokens: { access: string; refresh: string };
    user_role: string;
    deleted: string;
  };
  expires: string;
}) {
  return session;
}
