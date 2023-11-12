import { Router } from "express";
import { isAdmin } from "../middleware/admin";
import { withAuth } from "../middleware/auth";
import {
	deleteBook,
	getBook,
	getBookCategories,
	getBooks,
	getBooksByCategory,
	patchBook,
	postBook,
} from "../controllers/books";

const BookRoutes = Router();

BookRoutes.get("/", getBooks);
BookRoutes.get("/:bookId", getBook);
BookRoutes.get("/category/list", getBookCategories);
BookRoutes.get("/category/:category", getBooksByCategory);
BookRoutes.post("/", withAuth, isAdmin, postBook);
BookRoutes.patch("/:bookId", withAuth, isAdmin, patchBook);
BookRoutes.delete("/:bookId", withAuth, isAdmin, deleteBook);

export default BookRoutes;
