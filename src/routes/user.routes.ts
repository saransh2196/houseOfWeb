import express, { Request, Response } from "express";
import User, { IUser } from "../models/user";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const newUser = new User(req.body);
  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/users/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
