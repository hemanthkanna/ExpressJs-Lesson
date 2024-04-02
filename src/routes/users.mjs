import { Router } from "express";
import {
  checkSchema,
  matchedData,
  query,
  validationResult,
} from "express-validator";
import { sampleUsers } from "../utils/constantData.mjs";
import { userValidationSchema } from "../utils/validationSchema.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import User from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();

router.get(
  "/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("must not be empty")
    .isLength({ min: 3, max: 5 })
    .withMessage("must have  at least 3 - 5 characters"),
  (req, res) => {
    // console.log(req.session);
    console.log(req.session.id);
    req.sessionStore.get(req.session.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log("Inside SessionStore Get");
      console.log(sessionData);
    });

    console.log(req["express-validator#contexts"]);
    const result = validationResult(req);
    console.log(result);

    const {
      query: { filter, value },
    } = req;

    // if (!result.isEmpty()) {
    //   return res.status(400).send({ errors: result.array() });
    // }

    console.log(`filter : ${filter}, value: ${value}`);
    if (filter && value) {
      return res.send(
        sampleUsers.filter((user) => user[filter].includes(value))
      );
    }

    return res.send(sampleUsers);
  }
);

router.get("/users/:id", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.sessionStore.get(req.session.id, (err, sessionData) => {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(sessionData);
  });

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

router.post("/users", checkSchema(userValidationSchema), async (req, res) => {
  const result = validationResult(req);
  console.log(result);

  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() });
  }

  const data = matchedData(req);
  console.log(data);
  data.password = hashPassword(data.password);
  console.log(data);

  try {
    const user = await User.create(data);
    res.status(200).send({ user: user });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }

  // const user = { id: sampleUsers[sampleUsers.length - 1].id + 1, ...data };

  // sampleUsers.push(user);
  // return res.status(201).send(sampleUsers);
});

router.put("/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  sampleUsers[findUserIndex] = { id: sampleUsers[findUserIndex].id, ...body };
  res.sendStatus(201);
});

router.patch("/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  sampleUsers[findUserIndex] = { ...sampleUsers[findUserIndex], ...body };
  res.sendStatus(201);
});

router.delete("/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;

  sampleUsers.splice(findUserIndex, 1);
  res.sendStatus(201);
});

export default router;
