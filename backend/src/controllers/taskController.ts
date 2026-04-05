import { Response } from "express"
import prisma from "../utils/prisma"
import { AuthRequest } from "../middleware/auth"

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!
    const { status, search, page = "1", limit = "10" } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const where: any = { userId }

    if (status) {
      where.status = status
    }

    if (search) {
      where.title = {
        contains: search as string,
      }
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.count({ where }),
    ])

    return res.status(200).json({
      tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!
    const { id } = req.params

    const task = await prisma.task.findFirst({
      where: { id: parseInt(id), userId },
    })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    return res.status(200).json(task)
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!
    const { title, description, status } = req.body

    if (!title) {
      return res.status(400).json({ message: "Title is required" })
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "pending",
        userId,
      },
    })

    return res.status(201).json({ message: "Task created successfully", task })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!
    const { id } = req.params
    const { title, description, status } = req.body

    const existingTask = await prisma.task.findFirst({
      where: { id: parseInt(id), userId },
    })

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" })
    }

    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
      },
    })

    return res.status(200).json({ message: "Task updated successfully", task })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!
    const { id } = req.params

    const existingTask = await prisma.task.findFirst({
      where: { id: parseInt(id), userId },
    })

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" })
    }

    await prisma.task.delete({ where: { id: parseInt(id) } })

    return res.status(200).json({ message: "Task deleted successfully" })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const toggleTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!
    const { id } = req.params

    const existingTask = await prisma.task.findFirst({
      where: { id: parseInt(id), userId },
    })

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" })
    }

    const newStatus = existingTask.status === "completed" ? "pending" : "completed"

    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { status: newStatus },
    })

    return res.status(200).json({ message: "Task toggled successfully", task })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}