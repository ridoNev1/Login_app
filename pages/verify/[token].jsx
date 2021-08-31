import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";

const Verify = ({ user, verified, verifyErrorMessage }) => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!verified) {
      setMessage(verifyErrorMessage);
      setLoading(false);
    } else {
      (async () => {
        const updateVerif = await axios.patch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user?id=${user._id}`,
          {
            status: 1,
          }
        );
        if (updateVerif.status === 200) {
          Swal.fire({
            title: "Verification Success!",
            icon: "success",
            confirmButtonColor: "skyblue",
            confirmButtonText: "Next!",
          }).then(function () {
            window.location.href = "/user/login";
          });
        }
      })();
    }
  }, []);

  // const resendEmail = async () => {
  //   try {
  //     const resendMail = await axios.post(
  //       `${process.env.NEXT_PUBLIC_SERVER_URL}/api/controller/resend_email_verif`,
  //       user
  //     );
  //     alert(resendMail.data.message);
  //   } catch (error) {
  //     alert(error.response.data.message);
  //   }
  // };

  return (
    <div>
      {!loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
            backgroundColor: "whitesmoke",
            flexDirection: "column",
          }}
        >
          <h2>{message}</h2>
          <button
            style={{
              padding: "10px 20px",
              fontWeight: 500,
              color: "white",
              backgroundColor: "skyblue",
              outline: "none",
              border: "none",
              cursor: "pointer",
              borderRadius: 3,
              fontSize: 15,
            }}
            // onClick={resendEmail}
          >
            Resend email verification
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "whitesmoke",
            width: "100%",
          }}
        >
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const { token } = ctx.query;
  const cookieData = token;
  let decoded = null;
  if (cookieData) {
    decoded = jwt_decode(cookieData);
  }

  let verified = null;
  let verifyErrorMessage = null;

  const jwtKey = process.env.JWT_KEY;
  await jwt.verify(token, jwtKey, (err) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        verified = false;
        verifyErrorMessage =
          "This verification link has expired, please resend the email.";
      } else if (err.name === "JsonWebTokenError") {
        verified = false;
        verifyErrorMessage = "Authorization Failed!, please resend the email.";
      }
    } else {
      verified = true;
      return;
    }
  });

  return {
    props: {
      user: decoded,
      verified,
      verifyErrorMessage,
    },
  };
};

export default Verify;
