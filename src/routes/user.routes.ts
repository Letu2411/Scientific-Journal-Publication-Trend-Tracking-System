import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.get("/", authenticateToken, authorizeRoles("ADMIN"), getUsers);
router.get("/:id", authenticateToken, authorizeRoles("ADMIN"), getUserById);
router.post("/", authenticateToken, authorizeRoles("ADMIN"), createUser);
router.put("/:id", authenticateToken, authorizeRoles("ADMIN"), updateUser);
router.delete("/:id", authenticateToken, authorizeRoles("ADMIN"), deleteUser);

export default router;