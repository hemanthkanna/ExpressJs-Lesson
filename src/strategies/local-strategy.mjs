import passport from "passport";
import { Strategy } from "passport-local";
import { sampleUsers } from "../utils/constantData.mjs";
import User from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
  console.log("Inside SerializeUser");
  console.log(user);
});

passport.deserializeUser(async (id, done) => {
  console.log("Inside DeserializeUser");
  console.log(id);
  try {
    // const findUser = sampleUsers.find((user) => user.id === id);
    const findUser = await User.findById(id);

    if (!findUser) {
      throw new Error("User not found");
    }
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username: username });
      // const findUser = sampleUsers.find((user) => user.username === username);
      if (!findUser) {
        throw new Error("User not found");
      }
      if (!comparePassword(password, findUser.password)) {
        throw new Error("Invalid password");
      }
      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);
