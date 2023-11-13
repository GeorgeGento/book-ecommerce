import { Router } from "express";

import {
	deleteOrder,
	getOrder,
	getOrders,
	getUserOrders,
	patchOrder,
	postOrder,
} from "../controllers/orders";
import { isAdmin, isAdminOrOwner } from "../middleware/admin";

const OrderRoutes = Router();

OrderRoutes.get("/", isAdmin, getOrders);
OrderRoutes.get("/users/:userId", isAdminOrOwner, getUserOrders);
OrderRoutes.get("/:orderId", isAdminOrOwner, getOrder);

OrderRoutes.post("/", isAdminOrOwner, postOrder);
OrderRoutes.patch("/:orderId", isAdmin, patchOrder);
OrderRoutes.delete("/:orderId", isAdmin, deleteOrder);

export default OrderRoutes;
