import db from "../../../utils/dbConnect";
import { User } from "../../../utils/model/user";
import { loginSchema } from "../../../lib/validator/login";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";

db();

const login = async (req, res) => {
  const { method, body } = req;
  switch (method) {
    case "POST":
      try {
        const { error } = loginSchema.validate(body);
        if (error) throw new Error(error.details[0].message);

        const getUser = await User.findOne({
          $or: [
            {
              email: body.user,
            },
            {
              username: body.user,
            },
          ],
        });

        if (!getUser) {
          res.status(400).json({
            status: "Failed",
            code: 400,
            message: "Email/Username tidak terdaftar!",
          });
          return;
        }

        const correct = await bcrypt.compare(body.password, getUser.password);
        if (correct) {
          if (!getUser.status) {
            res.status(400).json({
              status: "Failed",
              code: 400,
              message:
                "Akun ini perlu aktivasi, silahkan cek kembali email anda!",
            });
          } else {
            const jwtKey = process.env.JWT_KEY;
            jwt.sign(
              {
                email: getUser.email,
                name: getUser.name,
                username: getUser.username,
                _id: getUser._id,
                profile_url: getUser.profile_url,
                level: getUser.level,
              },
              jwtKey,
              { expiresIn: "1h" },
              (err, token) => {
                if (err) throw new Error(err.message);
                res.setHeader(
                  "Set-Cookie",
                  cookie.serialize("token", token, {
                    httpOnly: true,
                    sameSite: "strict",
                    maxAge: 3600,
                    path: "/",
                    secure: false,
                  })
                );
                res.status(202).json({
                  code: 200,
                  message: "login success!",
                });
              }
            );
          }
        } else {
          res.status(400).json({
            status: "Failed",
            code: 400,
            message: "Password Salah",
          });
        }
      } catch (error) {
        res.status(400).json({
          status: "Failed",
          code: 400,
          message: error.message,
        });
      }

      break;

    default:
      break;
  }
};

module.exports = login;
