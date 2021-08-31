import Layout from "../components/Layout";
import Navbar from "../components/navbar";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import jwt_decode from "jwt-decode";

export default function Home({ user }) {
  return (
    <Layout title="Landing Page">
      <Navbar user={user} />
    </Layout>
  );
}

export const getServerSideProps = async (ctx) => {
  const cookieData = cookie.parse(ctx?.req?.headers?.cookie || "").token ?? "";
  const jwtKey = process.env.JWT_KEY;
  let decoded = null;
  jwt.verify(cookieData, jwtKey, (err) => {
    if (err) decoded = null;
    decoded = jwt_decode(cookieData);
  });

  return {
    props: { user: decoded },
  };
};
