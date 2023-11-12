import { Router } from "express";
import {
	cancelOrder,
	createOrder,
	successfulOrder,
} from "../controllers/payments";

const PaymentsRoutes = Router();

PaymentsRoutes.post("/paypal/create-order", createOrder);
PaymentsRoutes.post("/paypal/success", successfulOrder);
PaymentsRoutes.post("/paypal/cancel", cancelOrder);

export default PaymentsRoutes;
