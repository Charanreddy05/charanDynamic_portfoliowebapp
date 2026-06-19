import axios from "axios";
import { useState } from "react";

function ProfileUpload({ profileId }) {

  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const uploadImage = async () => {

    if (!file) {
      alert(
        "Please select image"
      );
      return;
    }

    try {

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "profileImage",
        file
      );

      // Upload Image
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      const uploadRes =
        await axios.post(
          `${API_URL}/upload/profile`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      const imageUrl =
        uploadRes.data.imageUrl;

      // Update Profile
      await axios.put(
        `${API_URL}/profile/${profileId}`,
        {
          profileImage:
            imageUrl,
        }
      );

      alert(
        "Profile Image Updated Successfully"
      );

      window.location.reload();

    } catch (error) {

      console.log(error);

      alert(
        "Upload Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="mt-3">

      <input
        type="file"
        className="form-control mb-2"
        accept="image/*"
        onChange={(e) =>
          setFile(
            e.target.files[0]
          )
        }
      />

      <button
        className="btn btn-primary"
        onClick={uploadImage}
        disabled={loading}
      >
        {
          loading
            ? "Uploading..."
            : "Upload Profile Photo"
        }
      </button>

    </div>

  );

}

export default ProfileUpload;