import { Router } from "express";
import { sampleUsersProducts } from "../utils/constantData.mjs";

const router = Router();

router.get("/products", (req, res) => {
  res.status(201).send(sampleUsersProducts);
});

export default router;
