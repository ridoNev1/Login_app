import React, { useState } from "react";
import Layout from "../../components/Layout";
import Navbar from "../../components/navbar";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import jwt_decode from "jwt-decode";
import { CameraIcon } from "@heroicons/react/outline";
import ImageUploader from "../../components/ProfileUpload";
import { User } from "../../utils/model/user";
import db from "../../utils/dbConnect";

const UserComp = ({ user }) => {
  const [showCropper, setShowCropper] = useState(false);

  return (
    <Layout title="Profile Data">
      {showCropper ? (
        <ImageUploader
          onClose={() => setShowCropper(false)}
          user={JSON.parse(user)}
        />
      ) : null}
      <div style={{ backgroundColor: "whitesmoke" }}>
        <Navbar user={JSON.parse(user)} />
        <div className="__profile-page">
          <div className="__profile-user-card">
            <img
              src="/banner profile.jpg"
              alt="myBanner"
              className="__profile-user-card-banner"
            />
            <div className="__profile-user-card-pp">
              <img
                src={
                  JSON.parse(user)?.profile_url ||
                  "/blank-profile-picture-973460_1280.png"
                }
                alt="nopictfound"
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  border: "4px solid white",
                  objectFit: "contain",
                  backgroundColor: "#d1d1d1",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  marginRight: -100,
                  marginBottom: -100,
                  backgroundColor: "whitesmoke",
                  width: 40,
                  height: 40,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={() => setShowCropper(true)}
              >
                <CameraIcon style={{ height: 30, width: 30, opacity: 0.7 }} />
              </div>
            </div>
            <div className="__profile-user-card-description">
              <p>{JSON.parse(user).name}</p>
              <p>@{JSON.parse(user).username}</p>
              <p>Email :</p>
              <p>{JSON.parse(user).email}</p>
              <p>Status : </p>
              <span
                className={
                  JSON.parse(user).level === 2
                    ? "__label-coloring-red"
                    : "__label-coloring-blue"
                }
              >
                {JSON.parse(user).level === 2 ? "admin" : "pengguna"}
              </span>
            </div>
          </div>
          <div className="__profile-all-user-list">
            <p>list user</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const cookieData = cookie.parse(ctx?.req?.headers?.cookie || "").token ?? "";
  const jwtKey = process.env.JWT_KEY;
  let decoded = null;
  if (cookieData) {
    jwt.verify(cookieData, jwtKey, (err) => {
      if (err) {
        return {
          redirect: {
            destination: "/user/login",
            permanent: false,
          },
        };
      } else {
        decoded = jwt_decode(cookieData);
      }
    });
  } else {
    return {
      redirect: {
        destination: "/user/login",
        permanent: false,
      },
    };
  }
  db();
  try {
    const getUserLogin = await User.findOne({ _id: decoded._id });
    return {
      props: { user: JSON.stringify(getUserLogin) },
    };
  } catch (error) {
    console.log(error);
  }
};

export default UserComp;
