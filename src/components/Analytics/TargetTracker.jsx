"use client";

import { useEffect, useState } from "react";
import { 
  Clock, 
  Calendar, 
  CheckCircle, 
  Edit, 
  Trash2, 
  Plus, 
  AlertTriangle, 
  ChevronUp, 
  ChevronDown,
  BookOpen,
  FileText,
  Monitor,
  Flag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Task categories with icons
const taskCategories = [
  { value: "study", label: "Study", icon: <BookOpen className="h-4 w-4" /> },
  { value: "assignment", label: "Assignment", icon: <FileText className="h-4 w-4" /> },
  { value: "exam", label: "Exam Prep", icon: <Monitor className="h-4 w-4" /> },
  { value: "other", label: "Other", icon: <Flag className="h-4 w-4" /> }
];

// Priority levels with colors
const priorityLevels = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-700" },
  { value: "medium", label: "Medium", color: "bg-amber-100 text-amber-700" },
  { value: "high", label: "High", color: "bg-red-100 text-red-700" }
];

const StudentTaskTracker = () => {
  // State for tasks
  const [tasks, setTasks] = useState(() => {
    // Load tasks from localStorage on initial render
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("studentTasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    }
    return [];
  });
  
  // State for new task form
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    dueTime: "17:00",
    category: "study",
    priority: "medium",
    completed: false,
    createdAt: new Date().toISOString()
  });
  
  // State for edit mode
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filterCompleted, setFilterCompleted] = useState(false);
  
  // Save tasks to localStorage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
  }, [tasks]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add or update a task
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingTaskId !== null) {
      // Update existing task
      setTasks(tasks.map(task => 
        task.id === editingTaskId ? 
        { ...newTask, id: editingTaskId } : 
        task
      ));
      setEditingTaskId(null);
    } else {
      // Add new task
      const taskWithId = {
        ...newTask,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, taskWithId]);
    }
    
    // Reset form
    setNewTask({
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      dueTime: "17:00",
      category: "study",
      priority: "medium",
      completed: false,
      createdAt: new Date().toISOString()
    });
    setShowForm(false);
  };
  
  // Start editing a task
  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      setNewTask(taskToEdit);
      setEditingTaskId(taskId);
      setShowForm(true);
    }
  };
  
  // Delete a task
  const handleDelete = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };
  
  // Toggle task completion status
  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? 
      { ...task, completed: !task.completed } : 
      task
    ));
  };
  
  // Check if a task is overdue
  const isOverdue = (task) => {
    if (task.completed) return false;
    
    const now = new Date();
    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
    return now > dueDateTime;
  };
  
  // Format relative time (e.g., "2 hours left", "Overdue by 1 day")
  const getRelativeTime = (task) => {
    const now = new Date();
    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
    const diffMs = dueDateTime - now;
    const diffHrs = diffMs / (1000 * 60 * 60);
    
    if (diffMs < 0) {
      // Overdue
      if (diffHrs > -24) {
        return `Overdue by ${Math.abs(Math.round(diffHrs))} hour${Math.abs(Math.round(diffHrs)) !== 1 ? 's' : ''}`;
      } else {
        const diffDays = Math.abs(Math.ceil(diffHrs / 24));
        return `Overdue by ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
      }
    } else {
      // Upcoming
      if (diffHrs < 1) {
        const diffMins = Math.ceil(diffMs / (1000 * 60));
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} left`;
      } else if (diffHrs < 24) {
        return `${Math.round(diffHrs)} hour${Math.round(diffHrs) !== 1 ? 's' : ''} left`;
      } else {
        const diffDays = Math.floor(diffHrs / 24);
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
      }
    }
  };
  
  // Sort tasks by due date and then by completion status
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    const dateA = new Date(`${a.dueDate}T${a.dueTime}`);
    const dateB = new Date(`${b.dueDate}T${b.dueTime}`);
    return dateA - dateB;
  });
  
  // Filter tasks based on completion status
  const filteredTasks = filterCompleted 
    ? sortedTasks 
    : sortedTasks.filter(task => !task.completed);
  
  // Get category icon
  const getCategoryIcon = (categoryValue) => {
    const category = taskCategories.find(cat => cat.value === categoryValue);
    return category ? category.icon : taskCategories[0].icon;
  };
  
  // Get priority style
  const getPriorityStyle = (priorityValue) => {
    const priority = priorityLevels.find(p => p.value === priorityValue);
    return priority ? priority.color : priorityLevels[0].color;
  };

  return (
    <Card className="w-full max-w-md bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-[#333B69]">Student Task Tracker</CardTitle>
          <button 
            onClick={() => setFilterCompleted(!filterCompleted)}
            className="text-sm font-medium text-blue-600 flex items-center gap-1"
          >
            {filterCompleted ? 'Hide Completed' : 'Show Completed'}
            {filterCompleted ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-sm text-gray-500">Manage your assignments and study sessions</p>
      </CardHeader>
      
      <CardContent>
        {/* Add New Task Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-2.5 mt-2 mb-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New Task
          </button>
        )}
        
        {/* Task Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title*
              </label>
              <input
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Complete Math Assignment"
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the task"
                rows="2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date*
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Time*
                </label>
                <input
                  type="time"
                  name="dueTime"
                  value={newTask.dueTime}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={newTask.category}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {taskCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={newTask.priority}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {priorityLevels.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTaskId(null);
                  setNewTask({
                    title: "",
                    description: "",
                    dueDate: new Date().toISOString().split("T")[0],
                    dueTime: "17:00",
                    category: "study",
                    priority: "medium",
                    completed: false,
                    createdAt: new Date().toISOString()
                  });
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                {editingTaskId !== null ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </form>
        )}
        
        {/* Task List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1 mt-2">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No tasks found. Add one to get started!</p>
            </div>
          ) : (
            filteredTasks.map(task => {
              const overdueStatus = isOverdue(task);
              const relativeTime = getRelativeTime(task);
              
              return (
                <div 
                  key={task.id} 
                  className={`p-3 rounded-lg border-l-4 ${
                    task.completed 
                      ? "border-l-green-500 bg-green-50" 
                      : overdueStatus 
                        ? "border-l-red-500 bg-red-50" 
                        : `border-l-blue-500 bg-blue-50`
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    {/* Checkbox */}
                    <button 
                      className="mt-1 flex-shrink-0" 
                      onClick={() => toggleComplete(task.id)}
                      aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                    >
                      <CheckCircle className={`h-5 w-5 ${
                        task.completed 
                          ? "text-green-600 fill-green-600" 
                          : "text-gray-300"
                      }`} />
                    </button>
                    
                    {/* Task Content */}
                    <div className="flex-1">
                      <h3 className={`text-sm font-semibold ${
                        task.completed ? "text-gray-500 line-through" : "text-gray-800"
                      }`}>
                        {task.title}
                      </h3>
                      
                      {task.description && (
                        <p className={`text-xs mt-1 ${
                          task.completed ? "text-gray-400 line-through" : "text-gray-600"
                        }`}>
                          {task.description}
                        </p>
                      )}
                      
                      {/* Task Info: Time & Category */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                        <div className="flex items-center text-xs">
                          <Clock className={`h-3 w-3 mr-1 ${
                            task.completed 
                              ? "text-gray-400" 
                              : overdueStatus 
                                ? "text-red-500" 
                                : "text-blue-500"
                          }`} />
                          <span className={`${
                            task.completed 
                              ? "text-gray-400" 
                              : overdueStatus 
                                ? "text-red-500" 
                                : "text-gray-600"
                          }`}>
                            {task.dueDate} at {task.dueTime}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-xs">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="text-gray-500">
                            {!task.completed && relativeTime}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getPriorityStyle(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                          
                          <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                            {getCategoryIcon(task.category)}
                            {taskCategories.find(cat => cat.value === task.category)?.label || task.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Task Actions */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(task.id)}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        aria-label="Edit task"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                        aria-label="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Warning for overdue tasks */}
                  {!task.completed && overdueStatus && (
                    <div className="mt-1 text-xs flex items-center text-red-600">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      This task is overdue
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        {/* Stats Footer */}
        <div className="mt-4 flex justify-between items-center text-xs text-gray-500 border-t border-gray-200 pt-3">
          <div>
            <span>Total: {tasks.length}</span>
            <span className="mx-2">•</span>
            <span>Completed: {tasks.filter(t => t.completed).length}</span>
          </div>
          <div>
            <span>Pending: {tasks.filter(t => !t.completed).length}</span>
            <span className="mx-2">•</span>
            <span>Overdue: {tasks.filter(t => isOverdue(t)).length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentTaskTracker;