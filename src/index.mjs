import express from "express";
import routes from "./routes/index.routes.mjs";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser("KANNA"));

app.use("/api", routes);

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.url} - ${req.method}`);
  next();
};

app.use(loggingMiddleware);

app.get("/", loggingMiddleware, (req, res) => {
  res.cookie("entry", "Welcome User", { maxAge: 60000, signed: true });
  res.status(201).send({
    message: "Hello World!!",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
