import { Router } from "express";
import {
  createSetting,
  deleteSetting,
  getSettingByKey,
  getSettings,
  updateSetting,
} from "../controllers/setting.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.get("/", authenticateToken, authorizeRoles("ADMIN"), getSettings);
router.get("/:key", authenticateToken, authorizeRoles("ADMIN"), getSettingByKey);
router.post("/", authenticateToken, authorizeRoles("ADMIN"), createSetting);
router.put("/:key", authenticateToken, authorizeRoles("ADMIN"), updateSetting);
router.delete("/:key", authenticateToken, authorizeRoles("ADMIN"), deleteSetting);

export default router;