import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

const sampleUsers = [
  {
    id: 1,
    username: "kanna",
    password: "<PASSWORD>",
  },
  {
    id: 2,
    username: "raj",
    password: "<PASSWORD>",
  },
  {
    id: 3,
    username: "hemanth",
    password: "<PASSWORD>",
  },
];

const sampleUsersProducts = [
  {
    id: 1,
    name: "shirt",
    price: 100,
  },
  {
    id: 2,
    name: "pants",
    price: 200,
  },
  {
    id: 3,
    name: "shoes",
    price: 300,
  },
];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.status(201).send({
    message: "Hello World!!",
  });
});

app.get("/api/users", (req, res) => {
  res.status(201).send(sampleUsers);
});

app.get("/api/products", (req, res) => {
  res.status(201).send(sampleUsersProducts);
});

app.get("/api/users/:id", (req, res) => {
  console.log(req.params);
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) {
    return res.status(400).send({ message: "Bad Request. Invalid id" });
  }

  const user = sampleUsers.find((user) => user.id === parsedId);

  if (!user) {
    return res.status(404).send({ message: "User Not Found" });
  }

  return res.send(user);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
