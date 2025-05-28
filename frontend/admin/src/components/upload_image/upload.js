import {
    ref,
    uploadBytes,
    getDownloadURL,
    uploadBytesResumable,
  } from "firebase/storage";
  import mammoth from "mammoth";
import { storage } from "./firebaseConfig";
  
  // Function to generate a random string of specified length
  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  
  export const uploadImage = async (image) => {
    if (image) {
      const randomString = generateRandomString(6);
      const newFileName = `${
        image.name.split(".")[0]
      }_${randomString}.${image.name.split(".").pop()}`;
      const storageRef = ref(storage, `images/${newFileName}`);
      const snapshot = await uploadBytes(storageRef, image);
      const url = await getDownloadURL(snapshot.ref);
      //console.log("File available at", url);
      return url;
    }
    return null;
  };
  
  export const uploadFile = async (file) => {
    if (!file) return null;
  
    const randomString = generateRandomString(6);
    const newFileName = `${file.name.split(".")[0]}_${randomString}.${file.name
      .split(".")
      .pop()}`;
    const storageRef = ref(storage, `files/${newFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    try {
      await uploadTask;
  
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      //console.log("File available at", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Upload failed or failed to get download URL", error);
      return null;
    }
  };
  
  export const getFileContent = async (fileUrl) => {
    try {
      // Sử dụng fetch để tải file từ URL
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Lấy nội dung file dưới dạng ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
  
      // Giải mã ArrayBuffer thành nội dung của file .docx sử dụng mammoth
      const {value } = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
  
      // Trả về nội dung của file
      return value;
    } catch (error) {
      console.error("Error fetching or decoding file content:", error);
      return null;
    }
  };
  