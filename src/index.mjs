import express from "express";
import {
  body,
  matchedData,
  query,
  validationResult,
  checkSchema,
} from "express-validator";
import { userValidationSchema } from "./utils/validationSchema.mjs";

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

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.url} - ${req.method}`);
  next();
};

const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return res.status(400).send({ message: "Bad Request. Invalid id" });
  }
  const findUserIndex = sampleUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) {
    return res.sendStatus(404);
  }
  req.findUserIndex = findUserIndex;
  next();
};

app.use(loggingMiddleware);

app.get("/", loggingMiddleware, (req, res) => {
  res.status(201).send({
    message: "Hello World!!",
  });
});

app.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("must not be empty")
    .isLength({ min: 3, max: 5 })
    .withMessage("must have  at least 3 - 5 characters"),
  (req, res) => {
    console.log(req["express-validator#contexts"]);
    const result = validationResult(req);
    console.log(result);
    const {
      query: { filter, value },
    } = req;

    if (filter && value) {
      return res.send(
        sampleUsers.filter((user) => user[filter].includes(value))
      );
    }

    return res.send(sampleUsers);
  }
);

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

app.post("/api/users", checkSchema(userValidationSchema), (req, res) => {
  const result = validationResult(req);
  console.log(result);

  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() });
  }

  const data = matchedData(req);

  const user = { id: sampleUsers[sampleUsers.length - 1].id + 1, ...data };

  sampleUsers.push(user);
  return res.status(201).send(sampleUsers);
});

app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  sampleUsers[findUserIndex] = { id: sampleUsers[findUserIndex].id, ...body };
  res.sendStatus(201);
});

app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  sampleUsers[findUserIndex] = { ...sampleUsers[findUserIndex], ...body };
  res.sendStatus(201);
});

app.delete("/api/users/:id", (req, res) => {
  const { findUserIndex } = req;

  sampleUsers.splice(findUserIndex, 1);
  res.sendStatus(201);
});

app.get("/api/products", (req, res) => {
  res.status(201).send(sampleUsersProducts);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
