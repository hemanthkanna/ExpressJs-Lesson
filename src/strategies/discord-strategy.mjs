import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";

passport.serializeUser((user, done) => {
  console.log("Inside SerializeUser");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await DiscordUser.findById(id);
    return findUser ? done(null, findUser) : done(null, null);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: process.env.CLIENT_ID || "1224961433591091260",
      clientSecret:
        process.env.CLIENT_SECRET || "6fa9NODFvA3X2jOgI85na57YwqfTZMrz",
      callbackURL:
        process.env.CALLBACK_URL ||
        "http://localhost:3000/api/auth/discord/redirect",
      scope: ["identify"],
      // state: true,
      // passReqToCallback: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      let findUser;
      try {
        findUser = await DiscordUser.findOne({ discordId: profile.id });
      } catch (err) {
        return done(err, null);
      }

      try {
        if (!findUser) {
          const newUser = new DiscordUser({
            discordId: profile.id,
            username: profile.username,
            avatar: profile.avatar,
          });
          const newSavedUser = await newUser.save();
          return done(null, newSavedUser);
        }
        return done(null, findUser);
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);
