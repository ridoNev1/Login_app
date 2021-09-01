import React from "react";

const Hero = () => {
  return (
    <div
      style={{
        height: "80vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <img src="/3293465.jpg" alt="image" style={{ width: "30%" }} />
      <h2 className="__login-highlight" style={{ fontSize: 40 }}>
        Welcome to Login App!
      </h2>
    </div>
  );
};

export default Hero;
