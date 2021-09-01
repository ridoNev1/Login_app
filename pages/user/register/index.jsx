import React, { useState } from "react";
import Layout from "../../../components/Layout";
import Router from "next/router";
import Swal from "sweetalert2";
import axios from "axios";
import AlertError from "../../../components/error_alert";

const index = () => {
  const [registerData, setRegisterData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChage = (e) => {
    const key = e?.target?.name || e?.name;
    const value = e?.target?.value || e?.value;

    setRegisterData((old) => ({
      ...old,
      [key]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true);
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user`,
          registerData
        );
        Swal.fire({
          title: "Berhasil Mendaftar!",
          icon: "success",
          confirmButtonColor: "skyblue",
          confirmButtonText: "ok",
        }).then(function () {
          window.location.href = "/user/login";
        });
      } catch (error) {
        console.log(error.response.data.message);
        setIsError(
          error.response.data.message.includes(
            "required pattern: /^[a-zA-Z0-9]{8,30}$/"
          )
            ? "Pasword minimal 8 karakter tanpa simbol, dengan kombinasi huruf besar dan angka."
            : error.response.data.message
        );
        setLoading(false);
      }
    }
  };

  return (
    <Layout title="Daftar">
      <div className="__register-page">
        <div className="__register-container">
          <div className="__register-inner-container">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="/undraw_secure_login_pdn4.svg"
                alt="image-login"
                style={{ width: 270 }}
              />
            </div>
            <div>
              <p className="__login-highlight">Daftar sekarang</p>
              <p className="__login-highlight-desc">
                Lengkapi data anda untuk bisa masuk
              </p>
              <form
                action="submit"
                className="__login-form"
                onSubmit={handleRegister}
              >
                {isError ? AlertError(isError) : null}
                <input
                  className="__login-form-username"
                  type="text"
                  placeholder="Nama"
                  name="name"
                  onChange={handleChage}
                />
                <input
                  className="__login-form-password"
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={handleChage}
                />
                <input
                  className="__login-form-password"
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={handleChage}
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  className="__login-form-password"
                  onChange={handleChage}
                />
                <button>
                  {loading ? <div className="lds-dual-ring"></div> : "Daftar"}
                </button>
              </form>
              <p className="__login-page-register-link">
                Sudah memiliki akun?{" "}
                <span onClick={() => Router.push("/user/login")}>Masuk</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default index;
