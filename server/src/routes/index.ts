import { Router } from "express";
import AuthRoutes from "./auth";
import BookRoutes from "./books";
import UserRoutes from "./users";
import { withAuth } from "../middleware/auth";
import OrderRoutes from "./orders";
import UploadRoutes from "./upload";
import PaymentsRoutes from "./payments";

const Routes = Router();

Routes.use("/auth", AuthRoutes);
Routes.use("/users", withAuth, UserRoutes);
Routes.use("/books", BookRoutes);
Routes.use("/orders", withAuth, OrderRoutes);
Routes.use("/upload", UploadRoutes);
Routes.use("/payments", withAuth, PaymentsRoutes);

export default Routes;
