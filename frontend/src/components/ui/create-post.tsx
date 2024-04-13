import React, { useState, ChangeEvent, DragEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

interface CreatePostProps {
  onCreatePost: (photo: File, description: string) => void;
  session: any;
}

const CreatePost: React.FC<CreatePostProps> = ({ onCreatePost }) => {
  const { data: session } = useSession();

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    return () => {
      setPhoto(null);
      setDescription("");
    };
  }, [showPopup]);

  const checkSession = () => {
    if (session) {
      console.log("User is authenticated");
      return true;
    } else {
      console.log("User is not authenticated");
      return false;
    }
  };

  const handleCreatePostClick = () => {
    const isAuthenticated = checkSession();
    if (!isAuthenticated) {
      alert("Авторизуйтесь для создания поста");
      return;
    }
    setShowPopup(true);
  };

  const handleFileDrop = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file.type.startsWith("image/")) {
      setPhoto(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setPhoto(file);
      }
    }
  };

  const handleCreatePost = async () => {
    try {
      const formData = new FormData();
      formData.append("photo", photo as Blob);
      formData.append("description", description);

      const postResponse = await fetch("http://localhost:8000/api/v1/post", {
        method: "POST",
        body: JSON.stringify({ description: description }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.tokens.access}`,
        },
      });
      const postData = await postResponse.json();

      if (postResponse.ok && postData.id) {
        console.log("Post ID:", postData.id);
        const uploadResponse = await fetch(
          `http://localhost:8000/api/v1/post/${postData.id}?bucket=posts`,
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${session?.user.tokens.access}`,
            },
          },
        );

        if (uploadResponse.ok) {
          console.log("Post created successfully");
          onCreatePost(photo as File, description);
          setShowPopup(false);
        } else {
          console.error("Failed to upload photo and description");
        }
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="flex justify-center mt-2 w-full">
      <Button
        className="text-white font-bold py-2 px-4 rounded w-full"
        onClick={handleCreatePostClick}
      >
        Create Post
      </Button>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#9A9A9A] bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-[700px]">
            <div className="flex mb-4">
              <div className="grid place-content-center mr-4">
                <Avatar>
                  <AvatarImage
                    src={
                      "https://thypix.com/wp-content/uploads/2018/05/Sommerlandschaft-Bilder-11.jpg"
                    }
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <p className="text text-secondary-color mb-4 mt-4 mr-4 grid content-center">
                Что у вас нового?
              </p>
            </div>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter description"
              rows={4}
              className="w-full h-[120px] px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-grey-500"
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
            />
            {photo && (
              <img
                src={URL.createObjectURL(photo)}
                alt="Preview"
                className="w-[300px] h-[400px] mt-2 object-cover rounded-lg"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
            <hr />
            <div className="flex justify-end mt-4">
              <Button
                className="text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleCreatePost}
              >
                Опубликовать
              </Button>
              <Button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => setShowPopup(false)}
              >
                Закрыть
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
