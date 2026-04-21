import { Router } from "express";

const router = Router();

router.post("/login", (req, res) => {
  const { username } = req.body;
  res.json({
    ok: true,
    user: { username },
    message: "Login route placeholder"
  });
});

router.post("/register", (req, res) => {
  const { username } = req.body;
  res.json({
    ok: true,
    user: { username },
    message: "Register route placeholder"
  });
});

export default router;

