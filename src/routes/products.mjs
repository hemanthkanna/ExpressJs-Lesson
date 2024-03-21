import { Router } from "express";
import { sampleUsersProducts } from "../utils/constantData.mjs";

const router = Router();

router.get("/products", (req, res) => {
  console.log(req.headers.cookie);
  console.log(req.cookies);
  console.log(req.signedCookies.entry);
  // if (req.cookies.entry && req.cookies.entry === "Welcome User")
  if (req.signedCookies.entry && req.signedCookies.entry === "Welcome User")
    return res.status(201).send(sampleUsersProducts);

  return res.send({ msg: "Sorry we need a correct cookie" });
});

export default router;
