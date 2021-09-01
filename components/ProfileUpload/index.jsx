import React, { useCallback } from "react";
import Cropper from "react-easy-crop";
import CropedImage from "../../lib/cropedImage";
import { dataURLtoFile } from "../../lib/base64tofile";
import axios from "axios";
import { BackspaceIcon } from "@heroicons/react/outline";
import Swal from "sweetalert2";
import Router from "next/router";

const ProfileUpload = ({ onClose, user, refetchData }) => {
  const inputRef = React.useRef();
  const triggerFileSelectPopup = () => inputRef.current.click();
  const [image, setImage] = React.useState(null);
  const [croppedArea, setCroppedArea] = React.useState(null);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [imageName, setImageName] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const onCropComplete = useCallback(
    (croppedAreaPercent, croppedAreaPixels) => {
      setCroppedArea(croppedAreaPixels);
    },
    []
  );

  const onSelectFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      setImageName(event.target.files[0].name);
      reader.readAsDataURL(event.target.files[0]);
      reader.addEventListener("load", () => {
        setImage(reader.result);
      });
    }
  };

  const handleSaveImage = async () => {
    setLoading(true);
    const images = await CropedImage(image, croppedArea);
    const resultImage = await dataURLtoFile(images, imageName);
    const generateNameImage =
      new Date()
        .toString()
        .slice(0, 24)
        .split(" ")
        .join("")
        .split(":")
        .join("") + resultImage.name;

    try {
      const fd = new FormData();
      fd.append("image", resultImage);
      const uploadImage = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/upload_image?name=${generateNameImage}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (uploadImage.status === 200) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user?id=${user._id}`,
          {
            profile_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/post_images/${generateNameImage}`,
          }
        );

        onClose();
        Router.replace(Router.asPath);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Terjadi Kesalahan!",
        icon: "error",
        confirmButtonColor: "skyblue",
        confirmButtonText: "ok",
      });
    }
  };

  return (
    <div className="container-upload-image">
      <div className="container-cropper-upload-image">
        <BackspaceIcon
          style={{
            height: 40,
            width: 40,
            color: "white",
            marginTop: 20,
            marginLeft: 20,
            cursor: "pointer",
          }}
          onClick={onClose}
        />
        {image ? (
          <>
            <div className="cropper-upload-image">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          </>
        ) : null}
      </div>

      <div className="container-buttons-upload-image">
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={onSelectFile}
          style={{ display: "none" }}
        />
        <button
          onClick={triggerFileSelectPopup}
          style={{ marginRight: "10px" }}
        >
          Choose Image
        </button>
        {image ? (
          <button
            style={{ marginRight: "10px" }}
            type="primary"
            onClick={handleSaveImage}
          >
            {loading ? <div className="lds-dual-ring"></div> : "Save"}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ProfileUpload;
