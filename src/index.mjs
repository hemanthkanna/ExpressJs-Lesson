import express from "express";
import routes from "./routes/index.routes.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { sampleUsers } from "./utils/constantData.mjs";
import passport from "passport";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser("KANNA"));
app.use(
  session({
    secret: "DD87AC2ABA8B8",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60000 * 60 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", routes);

// const loggingMiddleware = (req, res, next) => {
//   console.log(`${req.url} - ${req.method}`);
//   next();
// };

// app.use(loggingMiddleware);

// app.get("/", loggingMiddleware, (req, res) => {
//   console.log(req.session);
//   console.log(req.session.id);
//   req.session.visited = true;
//   res.cookie("entry", "Welcome User", { maxAge: 60000, signed: true });
//   res.status(201).send({
//     message: "Hello World!!",
//   });
// });

// app.post("/api/auth", (req, res) => {
//   const {
//     body: { username, password },
//   } = req;

//   const user = sampleUsers.find((user) => user.username === username);
//   if (!user || user.password !== password) {
//     return res.status(404).send({ message: "BAD CREDENTIALS" });
//   }

//   req.session.user = user;
//   return res.status(200).send({
//     message: "AUTHENTICATED",
//     user: user,
//   });
// });

// app.get("/api/auth/status", (req, res) => {
//   req.sessionStore.get(req.sessionID, (err, session) => {
//     console.log(session);
//   });
//   return req.session.user
//     ? res.status(200).send(req.session.user)
//     : res.status(401).send({ msg: "NOT AUTHENTICATED" });
// });

// app.post("/api/cart", (req, res) => {
//   if (!req.session.user) return res.sendStatus(401);
//   const { body: items } = req;

//   const { cart } = req.session;
//   if (cart) {
//     cart.push(items);
//   } else {
//     req.session.cart = [items];
//   }

//   return res.status(201).send(items);
// });

// app.get("/api/cart", (req, res) => {
//   if (!req.session.user) return res.sendStatus(401);
//   return res.send(req.session.cart ?? []);
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
