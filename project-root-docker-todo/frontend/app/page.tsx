"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, CheckCircle, Circle, Sparkles, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"

type Task = {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Tarayıcı depolamasından görevleri yükle
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks)
        // Tarihleri düzelt
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt || Date.now()),
        }))
        setTasks(tasksWithDates)
      } catch (e) {
        console.error("Görevler yüklenirken hata oluştu:", e)
        setTasks([])
      }
    }

    // Yükleme animasyonu için kısa bir gecikme
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  // Görevleri tarayıcı depolamasına kaydet
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  // Yeni görev ekle
  const addTask = () => {
    if (newTask.trim() !== "") {
      const task = {
        id: Date.now(),
        text: newTask,
        completed: false,
        createdAt: new Date(),
      }
      setTasks([...tasks, task])
      setNewTask("")
    }
  }

  // Görevi tamamlandı olarak işaretle
  const toggleComplete = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  // Görevi sil
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Filtrelenmiş görevleri al
  const getFilteredTasks = () => {
    switch (activeTab) {
      case "active":
        return tasks.filter((task) => !task.completed)
      case "completed":
        return tasks.filter((task) => task.completed)
      default:
        return tasks
    }
  }

  const filteredTasks = getFilteredTasks()

  // Tarih formatı
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-4"
          >
            <Sparkles className="h-16 w-16 text-white animate-pulse" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white"
          >
            Görev Listesi Yükleniyor...
          </motion.h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 py-10">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-md p-4"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          <div className="p-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <h1 className="text-3xl font-bold text-center">✨ Görev Listesi ✨</h1>
              <p className="text-center text-white/80 mt-3">Günlük görevlerinizi organize edin</p>
            </motion.div>
          </div>

          <div className="p-6 backdrop-blur-md">
            <div className="flex space-x-2 mb-6">
              <Input
                type="text"
                placeholder="Yeni görev ekle..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTask()
                }}
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-purple-500"
              />
              <Button
                onClick={addTask}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-none shadow-lg shadow-purple-500/30 transition-all duration-300"
              >
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>

            <Tabs defaultValue="all" onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid grid-cols-3 mb-6 bg-white/20 p-1">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  Tümü
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  Aktif
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  Tamamlanan
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                {filteredTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-white/70"
                  >
                    <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-medium">
                      {activeTab === "all"
                        ? "Henüz görev eklenmedi"
                        : activeTab === "active"
                          ? "Aktif görev yok"
                          : "Tamamlanan görev yok"}
                    </p>
                    <p className="mt-2 text-white/50">
                      {activeTab === "all"
                        ? "Yeni bir görev eklemek için yukarıdaki kutuyu kullanın"
                        : activeTab === "active"
                          ? "Tüm görevleriniz tamamlandı!"
                          : "Henüz hiç görev tamamlamadınız"}
                    </p>
                  </motion.div>
                ) : (
                  <ul className="space-y-3">
                    <AnimatePresence>
                      {filteredTasks.map((task) => (
                        <motion.li
                          key={task.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 20, opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex items-center justify-between p-4 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-300 ${
                            task.completed ? "bg-green-500/10 border-green-500/30" : "bg-white/10 hover:bg-white/20"
                          }`}
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <button
                              onClick={() => toggleComplete(task.id)}
                              className="transition-transform duration-300 hover:scale-110 focus:outline-none"
                            >
                              {task.completed ? (
                                <CheckCircle className="h-6 w-6 text-green-400" />
                              ) : (
                                <Circle className="h-6 w-6 text-white/70" />
                              )}
                            </button>
                            <div className="flex-1">
                              <span
                                className={`text-lg ${task.completed ? "line-through text-white/50" : "text-white"}`}
                              >
                                {task.text}
                              </span>
                              <div className="flex items-center mt-1 text-xs text-white/50">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{formatDate(task.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                            className="text-white/70 hover:text-red-400 hover:bg-red-500/20 transition-all duration-300"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </TabsContent>
            </Tabs>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-3 rounded-lg bg-white/10 border border-white/20 text-sm text-white/70 text-center"
            >
              <div className="flex justify-center space-x-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-purple-400 mr-2"></div>
                  <span>{tasks.filter((t) => !t.completed).length} aktif</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
                  <span>{tasks.filter((t) => t.completed).length} tamamlanan</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
