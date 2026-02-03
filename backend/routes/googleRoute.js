import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

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

    res.redirect(
      `https://pomoxp-production.up.railway.app/login/success?token=${token}`,
    );
  },
);
