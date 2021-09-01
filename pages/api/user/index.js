import db from "../../../utils/dbConnect";
import { User } from "../../../utils/model/user";
import { regSchema } from "../../../lib/validator/user";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import cookie from "cookie";

db();

const user = async (req, res) => {
  const { method, body, query } = req;
  switch (method) {
    case "POST":
      try {
        const { error } = regSchema.validate(body);
        if (error) throw new Error(error.details[0].message);

        const salt = await bcrypt.genSalt(10);
        const registration = await User.create({
          ...body,
          password: await bcrypt.hash(body.password, salt),
          level: 1,
        });

        if (registration) {
          const jwtKey = process.env.JWT_KEY;
          jwt.sign(
            {
              name: registration.name,
              email: registration.email,
              _id: registration._id,
            },
            jwtKey,
            { expiresIn: 60 * 10 },
            (err, token) => {
              if (err) throw new Error(err.message);
              const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                  user: process.env.EMAIL,
                  pass: process.env.EMAIL_APP_PW,
                },
              });

              const mailOptions = {
                from: process.env.EMAIL,
                to: body.email,
                subject: "LOGIN APP || Verification code",
                html: `<div>
                  <p>Click link bellow for verification :</p>
                  <a
                  href="${process.env.NEXT_PUBLIC_SERVER_URL}/verify/${token}"
                  style="
                    font-family: Arial;
                    cursor: pointer;
                  "
                  >
                    <button
                      style="
                        padding: 8px 14px;
                        font-family: Arial;
                        font-weight: bold;
                        cursor: pointer;
                        margin-bottom: 10;
                        outline: none;
                        border: none;
                        background-color: #2d5d83;
                        color: white;
                        border-radius: 5;
                      "
                    >
                      Verify Account
                    </button>
                  </a>
                </div>`,
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
            }
          );
        }

        res.status(200).json({
          status: "Success",
          code: 200,
          message: registration,
        });
      } catch (error) {
        res.status(400).json({
          status: "Failed",
          code: 400,
          message: error.message.includes(
            "E11000 duplicate key error collection"
          )
            ? "Email/Username already exist"
            : error.message,
        });
      }
      break;

    case "PATCH":
      try {
        const updateUser = await User.updateOne({ _id: query.id }, body);
        res.status(200).json({
          status: "Success",
          code: 200,
          message: updateUser,
        });
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

module.exports = user;
