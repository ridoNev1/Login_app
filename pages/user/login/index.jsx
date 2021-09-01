import React, { useState } from "react";
import Layout from "../../../components/Layout";
import axios from "axios";
import Swal from "sweetalert2";
import Router from "next/router";

const Login = () => {
  const [logInData, setLogInData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChage = (e) => {
    const key = e?.target?.name || e?.name;
    const value = e?.target?.value || e?.value;

    setLogInData((old) => ({
      ...old,
      [key]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true);
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/login`,
          logInData
        );

        Router.push("/profile_page");
      } catch (error) {
        Swal.fire({
          title: "Gagal masuk!",
          text: error.response.data.message,
          icon: "error",
          confirmButtonColor: "skyblue",
          confirmButtonText: "ok",
        });
        setLoading(false);
      }
    }
  };

  return (
    <Layout title="Masuk">
      <div className="__login-page">
        <div className="__login-container">
          <div className="__login-inner-container">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="/3293465.jpg"
                alt="image-login"
                style={{ width: 200, marginLeft: 12 }}
              />
            </div>
            <p className="__login-highlight">Masuk Sekarang</p>
            <p className="__login-highlight-desc">
              Lengkapi detail di bawah untuk melanjutkan
            </p>
            <form
              action="submit"
              className="__login-form"
              onSubmit={handleLogin}
            >
              <input
                className="__login-form-username"
                type="text"
                placeholder="Username atau Email"
                name="user"
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
                {loading ? <div className="lds-dual-ring"></div> : "Masuk"}
              </button>
            </form>
            <p className="__login-page-register-link">
              Belum memiliki akun?{" "}
              <span onClick={() => Router.push("/user/register")}>Daftar</span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
