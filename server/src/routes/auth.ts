import { Router } from "express";
import { login, register } from "../controllers/auth";

const AuthRoutes = Router();

AuthRoutes.post("/register", register);
AuthRoutes.post("/login", login);

export default AuthRoutes;
