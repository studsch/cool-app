"use client";
import React, { useState, useRef, useEffect } from "react";
import Croppie from "croppie";
import "croppie/croppie.css";
import MemoriesSign from "@/components/memories-sign/memoriesSign";
import Button from "@/components/ui/button/Button";
import { Files, FilesIcon } from "lucide-react";

const DragDropPreview: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const croppieRef = useRef<HTMLDivElement>(null);
  const croppieInstanceRef = useRef<Croppie | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (croppieInstanceRef.current) {
      croppieInstanceRef.current.destroy();
      croppieInstanceRef.current = null;
    }

    if (croppieRef.current && imageSrc) {
      croppieInstanceRef.current = new Croppie(croppieRef.current, {
        viewport: { width: 120, height: 120, type: "circle" },
        boundary: { width: 200, height: 130 },
        enableZoom: true,
        showZoomer: false,
      });

      croppieInstanceRef.current.bind({ url: imageSrc });

      const interval = setInterval(() => {
        croppieInstanceRef.current
          ?.result({
            type: "base64",
            size: "viewport",
          })
          .then((result: string) => {
            setResultImage(result);
          });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [imageSrc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="">
      <div className="max-w-[490px] max-h-[60px] mt-[10px] mb-[100px] m-auto  text-left">
        <h2 className="text-xl mb-8">
          Enter additional information, it will help other people to find you.
        </h2>
        <h2 className="text-3xl">Add a preview photo</h2>
      </div>
      <div
        onClick={handleClick}
        className="border-2 mb-[50px] cursor-pointer rounded-xl max-w-[490px] h-[120px] m-auto text-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p className="text-text-primary-color h-14 text-xl mt-2">
          Add a Throw a photo here or choose a path
        </p>
        <FilesIcon color="grey" size={35} className="m-auto mb-2" />
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >
        <p className="text-text-primary-color h-14 text-xl">
          This is how the photo will look, you can change it
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "45px",
        }}
      >
        <div
          ref={croppieRef}
          className="cr-boundary"
          style={{
            border: "none",
            width: "200px",
            height: "130px",
            position: "relative",
            margin: "auto",
          }}
        />
        {resultImage && (
          <img
            src={resultImage}
            alt="Result"
            style={{
              maxWidth: "120px",
              maxHeight: "120px",
              marginLeft: "20px",
              margin: "auto",
            }}
          />
        )}
      </div>
      <div className="text-text-primary-color h-14 text-xl">
        <p>You can change the icon at any time</p>
      </div>
      <div className="m-auto h-[160] flex justify-between">
        <Button type="submit" text="Skip" className="btn btn-secondary mr-3" />
        <Button type="submit" text="Finish" className="btn btn-primary" />
      </div>
    </div>
  );
};

export default DragDropPreview;
