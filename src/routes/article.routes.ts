import { Router } from "express";
import {
  createArticle,
  searchArticles,
  updateArticleStatus,
} from "../controllers/article.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.get("/", searchArticles);
router.post("/", authenticateToken, createArticle);
router.patch("/:articleId/status", authenticateToken, authorizeRoles("ADMIN"), updateArticleStatus);

export default router;
