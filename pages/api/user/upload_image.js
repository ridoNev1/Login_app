// @ts-nocheck
import Formidable from "formidable-serverless";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const file_name = req.query.name;
  return new Promise(async (resolve, reject) => {
    const form = new Formidable.IncomingForm({
      multiples: true,
      keepExtensions: true,
    });

    form
      .on("file", async (name, file) => {
        const data = fs.readFileSync(file.path);
        fs.writeFileSync(`public/uploads/post_images/${file_name}`, data);
      })
      .on("aborted", () => {
        reject(res.status(500).send("Aborted"));
      })
      .on("end", async (result) => {
        resolve(res.status(200).send("done"));
      });

    await form.parse(req);
  });
};
