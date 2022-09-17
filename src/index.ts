import { PrismaClient } from "@prisma/client";
import express, { Request, Response, Application } from "express";
import path from "path";
import multer from "multer";
const tmpFolder = path.resolve(__dirname, "..", "public/images");
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, tmpFolder);
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
import cors from "cors";

const allowedOrigins = ["http://localhost:4200"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

const prisma = new PrismaClient();

const app = express();

//app.use('/public',express.static(path.resolve(__dirname,'public')));
app.use("/public", express.static(path.resolve("public")));
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded());

app.get("/prueba", (req, res) => {
  console.log("prueba bababa");
  res.send("probando");
});
app.post("/postimagen", upload.single("image"), async (req, res) => {
  const { title, content, authorEmail } = req.body;
  const usuario = {
    title,
    content,
    published: false,
    author: { connect: { email: authorEmail } },
    image_name: " ",
  };
  var file = req.file?.originalname;
  file
    ? (usuario.image_name = `http://localhost:3000/public/images/${file}`)
    : (usuario.image_name = " ");

  let user = await prisma.post.create({ data: usuario });
  console.log(user);
  res.json(user);
});

app.post("/post", async (req, res) => {
  const { title, content, authorEmail } = req.body;
  console.log("cago", title, content, authorEmail);
  prisma.post
    .create({
      data: {
        title,
        content,
        published: false,
        author: { connect: { email: authorEmail } },
      },
    })
    .then((data) => {
      console.log("mis dato", data);
      res.json(data);
    });
});
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/buscar", async (req, res) => {
  let dato = req.body.dato;

  console.log(dato);
  const users = await prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: dato,
          },
        },
        {
          content: {
            contains: dato,
          },
        },
      ],
    },
  });

  res.json(users);
});

app.get("/usersPost", async (req, res) => {
  const users = await prisma.user.findMany({
    include: { posts: true },
  });
  res.json(users);
});

app.get("/feed", async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });
  res.json(posts);
});

app.get(`/post/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });
  res.json(post);
});

app.post(`/user`, async (req, res) => {
  const result = await prisma.user.create({
    data: { ...req.body },
  });
  res.json(result);
});

app.put("/post/publish/:id", async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: { published: true },
  });
  res.json(post);
});

app.delete(`/post/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: { id: Number(id) },
  });
  res.json(post);
});
app.listen(3000, () =>
  console.log("REST API server ready at: http://localhost:3000")
);
