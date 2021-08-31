import React, { useCallback } from "react";
import Cropper from "react-easy-crop";
import CropedImage from "../../lib/cropedImage";
import { dataURLtoFile } from "../../lib/base64tofile";
import axios from "axios";
import { ArrowSmLeftIcon } from "@heroicons/react/outline";

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
    // setLoading(true);
    const images = await CropedImage(image, croppedArea);
    const resultImage = await dataURLtoFile(images, imageName);

    console.log(resultImage);
  };

  return (
    <div className="container-upload-image">
      <div className="container-cropper-upload-image">
        <ArrowSmLeftIcon
          style={{
            height: 40,
            width: 40,
            color: "maroon",
            marginTop: 20,
            marginLeft: 20,
            cursor: "pointer",
            backgroundColor: "white",
            borderRadius: "50%",
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
        <button
          style={{ marginRight: "10px" }}
          type="primary"
          onClick={handleSaveImage}
          loading={loading}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfileUpload;
