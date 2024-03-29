import passport from "passport";
import { Strategy } from "passport-local";
import { sampleUsers } from "../utils/constantData.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
  console.log("Inside SerializeUser");
  console.log(user);
});

passport.deserializeUser((id, done) => {
  console.log("Inside DeserializeUser");
  console.log(id);
  try {
    const findUser = sampleUsers.find((user) => user.id === id);
    if (!findUser) {
      throw new Error("User not found");
    }
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy((username, password, done) => {
    console.log(`username : ${username}, password : ${password}`);
    try {
      const findUser = sampleUsers.find((user) => user.username === username);
      if (!findUser) {
        throw new Error("User not found");
      }

      if (findUser.password !== password) {
        throw new Error("Invalid password");
      }

      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);
