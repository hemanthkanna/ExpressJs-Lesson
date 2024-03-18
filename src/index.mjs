import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Hello World!!",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
