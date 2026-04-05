"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import toast, { Toaster } from "react-hot-toast"

interface Task {
  id: number
  title: string
  description: string
  status: string
  createdAt: string
}

interface TaskForm {
  title: string
  description: string
  status: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [form, setForm] = useState<TaskForm>({ title: "", description: "", status: "pending" })
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { page, limit: 10 }
      if (search) params.search = search
      if (filter) params.status = filter
      const res = await api.get("/tasks", { params })
      setTasks(res.data.tasks)
      setTotalPages(res.data.pagination.totalPages)
    } catch (err) {
      toast.error("Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }, [page, search, filter])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editTask) {
        await api.patch(`/tasks/${editTask.id}`, form)
        toast.success("Task updated!")
      } else {
        await api.post("/tasks", form)
        toast.success("Task created!")
      }
      setShowModal(false)
      setEditTask(null)
      setForm({ title: "", description: "", status: "pending" })
      fetchTasks()
    } catch (err) {
      toast.error("Something went wrong")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return
    try {
      await api.delete(`/tasks/${id}`)
      toast.success("Task deleted!")
      fetchTasks()
    } catch (err) {
      toast.error("Failed to delete task")
    }
  }

  const handleToggle = async (id: number) => {
    try {
      await api.patch(`/tasks/${id}/toggle`)
      toast.success("Task status updated!")
      fetchTasks()
    } catch (err) {
      toast.error("Failed to toggle task")
    }
  }

  const handleEdit = (task: Task) => {
    setEditTask(task)
    setForm({ title: task.title, description: task.description, status: task.status })
    setShowModal(true)
  }

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken")
    try {
      await api.post("/auth/logout", { refreshToken })
    } catch {}
    localStorage.clear()
    router.push("/login")
  }

  const openAddModal = () => {
    setEditTask(null)
    setForm({ title: "", description: "", status: "pending" })
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">TaskFlow</h1>
        <div className="flex items-center gap-4">
          <span className="text-indigo-200 hidden sm:block">
            👋 Hello, {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="bg-white text-indigo-600 px-4 py-1.5 rounded-lg font-semibold hover:bg-indigo-50 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
            <p className="text-gray-500 text-sm">Manage your daily tasks efficiently</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            + Add Task
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1) }}
            className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="text-center py-20 text-indigo-600 font-semibold">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No tasks found!</p>
            <p className="text-gray-400 text-sm mt-2">Click "+ Add Task" to create your first task</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => handleToggle(task.id)}
                    className="mt-1 w-4 h-4 accent-indigo-600 cursor-pointer"
                  />
                  <div>
                    <h3 className={`font-semibold text-gray-800 ${task.status === "completed" ? "line-through text-gray-400" : ""}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-500 text-sm mt-1">{task.description}</p>
                    )}
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full font-medium ${task.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editTask ? "Edit Task" : "Add New Task"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Task description (optional)"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  {editTask ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}