import express from "express";
import passport from "passport";

export const googleRoute = express.Router();

googleRoute.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

googleRoute.get(
  "/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { token } = req.user;

    res.redirect(`https://pomoxp.com/login/success?token=${token}`);
  },
);
