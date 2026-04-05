import { Router } from "express"
import { authenticate } from "../middleware/auth"
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from "../controllers/taskController"

const router = Router()

router.use(authenticate)

router.get("/", getTasks)
router.post("/", createTask)
router.get("/:id", getTask)
router.patch("/:id", updateTask)
router.delete("/:id", deleteTask)
router.patch("/:id/toggle", toggleTask)

export default router