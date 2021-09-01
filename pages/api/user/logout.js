import { serialize } from "cookie";

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      try {
        /* remove cookies from request header */
        res.setHeader("Set-Cookie", [
          serialize("token", "", {
            maxAge: -1,
            path: "/",
          }),
        ]);

        res.writeHead(302, { Location: "/user/login" });
        res.end();
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
