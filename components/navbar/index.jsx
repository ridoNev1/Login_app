import React from "react";
import Router from "next/router";

const Navbar = () => {
  return (
    <div className="__navbar-component">
      <div className="__navbar-container">
        <img src="/awembawek.svg" alt="" className="__navbar-logo" />
        <div className="__navbar-button">
          <button onClick={() => Router.push("/user/login")}>Masuk</button>
          <button>Daftar</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
