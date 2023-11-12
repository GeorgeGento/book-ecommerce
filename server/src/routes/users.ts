import { Router } from "express";
import {
	deleteUser,
	getUser,
	getUsers,
	patchUser,
	postUser,
} from "../controllers/users";
import { isAdmin, isAdminOrOwner } from "../middleware/admin";

const UserRoutes = Router();

UserRoutes.get("/", isAdmin, getUsers);
UserRoutes.get("/:userId", isAdminOrOwner, getUser);
UserRoutes.post("/", isAdmin, postUser);
UserRoutes.patch("/:userId", isAdminOrOwner, patchUser);
UserRoutes.delete("/:userId", isAdmin, deleteUser);

export default UserRoutes;
