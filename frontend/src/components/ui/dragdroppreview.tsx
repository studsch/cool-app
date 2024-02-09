"use client";
import React, { useState, useRef, useEffect } from "react";
import Croppie from "croppie";
import "croppie/croppie.css";

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
        viewport: { width: 150, height: 150, type: "circle" },
        boundary: { width: 400, height: 200 },
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
    <div
      style={{
        border: "2px solid grey",
        borderRadius: "10px",
        width: "600px",
        margin: "auto",
      }}
    >
      <div style={{ marginLeft: "10px", color: "#666666" }}>
        <div style={{ textAlign: "center" }}>
          <h2>Add a preview photo</h2>
        </div>
        <div
          onClick={handleClick}
          style={{
            border: "2px solid grey",
            padding: "30px",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            borderRadius: "10px",
            width: "300px",
            margin: "auto",
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p style={{ color: "#666666", margin: "0" }}>
            Add a Throw a photo here or choose a path
          </p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <p>This is how the photo will look, you can change it</p>
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
              width: "400px",
              height: "200px",
              position: "relative",
            }}
          />
          {resultImage && (
            <img
              src={resultImage}
              alt="Result"
              style={{
                maxWidth: "150px",
                maxHeight: "150px",
                marginLeft: "20px",
                paddingTop: "25px",
              }}
            />
          )}
        </div>
        <div style={{ textAlign: "center" }}>
          <p>You can change the icon at any time</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <button
            style={{
              width: "150px",
              marginRight: "20px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "15px 30px",
              cursor: "pointer",
              margin: "auto",
            }}
          >
            Skip
          </button>
          <button
            style={{
              width: "150px",
              backgroundColor: "#ff69b4",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "15px 30px",
              cursor: "pointer",
              margin: "auto",
            }}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default DragDropPreview;
