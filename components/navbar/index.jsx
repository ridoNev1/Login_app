import React from "react";
import Router from "next/router";

const Navbar = ({ user }) => {
  return (
    <div className="__navbar-component">
      <div className="__navbar-container">
        <img src="/awembawek.svg" alt="" className="__navbar-logo" />
        {user ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={
                user?.profile_url || "/blank-profile-picture-973460_1280.png"
              }
              alt="profile_pict"
              style={{
                width: 35,
                height: 35,
                borderRadius: "50%",
                marginRight: 12,
                objectFit: "cover",
                objectFit: "contain",
                backgroundColor: "#d1d1d1",
              }}
            />
            <p style={{ opacity: 0.7 }}>{user.name}</p>
          </div>
        ) : (
          <div className="__navbar-button">
            <button onClick={() => Router.push("/user/login")}>Masuk</button>
            <button onClick={() => Router.push("/user/register")}>
              Daftar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
