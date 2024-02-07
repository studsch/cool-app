"use client";
import React, { useState, useCallback, useRef } from "react";

// Тип для объекта стилей
type Styles = {
  container: React.CSSProperties;
  uploadArea: React.CSSProperties;
  uploadAreaHover: React.CSSProperties;
  previewImg: React.CSSProperties;
  previewImgImg: React.CSSProperties;
  buttons: React.CSSProperties;
  button: React.CSSProperties;
  skip: React.CSSProperties;
};

// Объект стилей
const styles: Styles = {
  container: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "350px", // Подстройте под свои нужды
    margin: "auto",
  },
  uploadArea: {
    border: "2px dashed #ddd",
    padding: "30px",
    marginBottom: "20px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
    borderRadius: "8px",
  },
  uploadAreaHover: {
    background: "#fafafa",
  },
  previewImg: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    overflow: "hidden",
    margin: "10px auto", // Центрирование блока с изображением
    position: "relative", // Для абсолютного позиционирования внутреннего img
  },
  previewImgImg: {
    width: "100%",
    height: "auto",
    position: "absolute", // Абсолютное позиционирование
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)", // Центрирование изображения
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  },
  button: {
    background: "#ec5990",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    padding: "10px 20px",
    cursor: "pointer",
    margin: "0 10px",
    outline: "none",
  },
  skip: {
    background: "none",
    border: "none",
    color: "#333",
    textDecoration: "underline",
    cursor: "pointer",
    outline: "none",
  },
};

const DragDropPreview = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      updateImage(file);
    }
  }, []);

  const updateImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        updateImage(file);
      }
    },
    [updateImage],
  );

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Add a preview photo</h2>
      <div
        style={
          isDragOver
            ? { ...styles.uploadArea, ...styles.uploadAreaHover }
            : styles.uploadArea
        }
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={openFileDialog}
      >
        {imageSrc ? (
          <div style={styles.previewImg}>
            <img src={imageSrc} alt="Preview" style={styles.previewImgImg} />
          </div>
        ) : (
          <div>Select or drag and drop a photo here</div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg"
        style={{ display: "none" }}
        onChange={onFileChange}
      />
      <div style={styles.buttons}>
        <button style={styles.skip}>Skip</button>
        <button style={styles.button}>Finish</button>
      </div>
    </div>
  );
};

export default DragDropPreview;
