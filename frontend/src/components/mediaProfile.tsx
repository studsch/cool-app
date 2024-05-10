import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import PostCard from "./card/card";
import { Button } from "@/components/ui/button";

interface PhotoGridProps {
  id: string;
  description: string;
  location: string;
  imageURLs?: string[];
  userAvatar: string;
  userFirstName: string;
  userLastName: string;
  createdAt: string;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ id }) => {
  const { data: session } = useSession();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const popUpRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<PhotoGridProps[]>([]);
  const [pageSize, setPageSize] = useState<number>(30);

  const closePopup = () => {
    setSelectedPhoto(null);
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/post/user/${session?.user.id}?page=1&size=50`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user.tokens.access}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPosts(data.posts);
        setPageSize(data.size);
      } catch (error) {
        console.error("There was a problem with fetching posts:", error);
      }
    };

    fetchUserPosts();
  }, [id, session]);

  const [selectedPost, setSelectedPost] = useState<PhotoGridProps | null>(null);

  const openPopup = (post: PhotoGridProps) => {
    setSelectedPost(post);
    setSelectedPhoto(post.imageURLs ? post.imageURLs[0] : null); // Устанавливаем selectedPhoto
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popUpRef.current &&
        !popUpRef.current.contains(event.target as Node)
      ) {
        setSelectedPost(null); // Закрытие popup при клике вне области PostCard
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-wrap">
      {posts
        .slice(0, pageSize)
        .reverse()
        .map((post, index) => (
          <div
            key={index}
            onClick={() => openPopup(post)}
            className="cursor-pointer"
          >
            <img
              src={`http://localhost:9000/${
                post.imageURLs ? post.imageURLs[0] : ""
              }`}
              className="w-[192px] h-[256px] ml-1 mr-1 mt-1 mb-1 object-cover rounded-sm"
              alt={`Photo ${index + 1}`}
            />
          </div>
        ))}
      {selectedPost && (
        <div className="fixed overflow-auto top-0 left-0 z-50 w-full h-full bg-[#9A9A9A] bg-opacity-50">
          <div ref={popUpRef}>
            <Button
              className="absolute top-2 right-2 colore-white"
              onClick={() => setSelectedPost(null)} // Закрытие popup при клике на кнопку
            >
              Скрыть
            </Button>
            <PostCard
              id={selectedPost.id}
              userPhoto={`http://localhost:9000/${selectedPost.userAvatar}`}
              userName={selectedPost.userFirstName}
              userSName={selectedPost.userLastName}
              photo={
                selectedPhoto ? `http://localhost:9000/${selectedPhoto}` : ""
              }
              description={selectedPost.description}
              createdAt={selectedPost.createdAt}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;
