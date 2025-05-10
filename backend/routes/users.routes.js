import { Router } from "express";
import { login, register } from "../controllers/user.controller.js";

const router = Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/add_to_activitty");
router.route("/get_all_activity");

export default router;
