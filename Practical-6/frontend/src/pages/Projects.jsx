import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api';

export default function Projects() {
  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Form state for creation
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [creatingTask, setCreatingTask] = useState(false);

  // Edit modal state
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [editStatus, setEditStatus] = useState('pending');
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  // Delete confirmation modal state
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Notification Toast state
  const [toast, setToast] = useState(null);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // 1. READ TASKS - Fetch tasks on mount
  const fetchTaskList = async () => {
    setLoadingTasks(true);
    setFetchError(null);
    try {
      const data = await getTasks();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      setFetchError(err.message || 'Failed to fetch tasks from backend server.');
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTaskList();
  }, []);

  // 2. CREATE TASK - Submit form handler
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showNotification('Task title is required.', 'error');
      return;
    }

    setCreatingTask(true);
    try {
      const newTaskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        completed: status === 'completed',
      };
      const created = await createTask(newTaskData);
      
      // Update local state using confirmed backend response (Source of Truth)
      setTasks((prev) => [created, ...prev]);
      
      // Clear form inputs
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('pending');

      showNotification(`Task "${created.title}" created successfully!`, 'success');
    } catch (err) {
      showNotification(`Failed to create task: ${err.message}`, 'error');
    } finally {
      setCreatingTask(false);
    }
  };

  // 3. UPDATE TASK - Start Editing
  const openEditModal = (task) => {
    setEditingTask(task);
    setEditTitle(task.title || '');
    setEditDescription(task.description || '');
    setEditPriority(task.priority || 'medium');
    setEditStatus(task.status || (task.completed ? 'completed' : 'pending'));
  };

  const closeEditModal = () => {
    setEditingTask(null);
  };

  // Submit Task Update handler
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      showNotification('Task title cannot be empty.', 'error');
      return;
    }

    setUpdatingTaskId(editingTask._id);
    try {
      const updatedData = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        status: editStatus,
        completed: editStatus === 'completed',
      };

      const updated = await updateTask(editingTask._id, updatedData);
      
      // Update state with server response
      setTasks((prev) =>
        prev.map((t) => (t._id === editingTask._id ? updated : t))
      );

      showNotification(`Task "${updated.title}" updated successfully!`, 'success');
      closeEditModal();
    } catch (err) {
      showNotification(`Failed to update task: ${err.message}`, 'error');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Toggle quick status (Complete / Pending)
  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'completed' || task.completed ? 'pending' : 'completed';
    setUpdatingTaskId(task._id);
    try {
      const updated = await updateTask(task._id, {
        status: nextStatus,
        completed: nextStatus === 'completed',
      });

      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? updated : t))
      );

      showNotification(`Task marked as ${nextStatus}!`, 'success');
    } catch (err) {
      showNotification(`Failed to toggle status: ${err.message}`, 'error');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // 4. DELETE TASK - Prompt custom confirmation modal
  const promptDeleteModal = (task) => {
    setTaskToDelete(task);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    const task = taskToDelete;
    setDeletingTaskId(task._id);
    try {
      await deleteTask(task._id);
      
      // Remove from state only after server confirmation
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
      
      showNotification(`Task "${task.title}" deleted successfully!`, 'success');
      setTaskToDelete(null);
    } catch (err) {
      showNotification(`Failed to delete task: ${err.message}`, 'error');
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Filter tasks logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const taskStatus = task.status || (task.completed ? 'completed' : 'pending');
    const matchesStatus =
      statusFilter === 'all' || taskStatus === statusFilter;

    const matchesPriority =
      priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="bg-background dark:bg-inverse-surface/10 py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto duration-300 min-h-[85vh]">
      
      {/* Floating Notification Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 border animate-bounce ${
            toast.type === 'error'
              ? 'bg-red-600 text-white border-red-700'
              : 'bg-emerald-600 text-white border-emerald-700'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <p className="font-medium text-sm pr-2">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="hover:opacity-75 text-white/80 p-1"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-[#5c8bee] rounded-full mb-3 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Backend API: http://localhost:5000
          </div>
          <h2 className="font-headline-md text-[32px] md:text-[40px] text-on-surface dark:text-white mb-2 font-bold">
            Task Management System
          </h2>
          <p className="font-body-md text-on-surface-variant dark:text-gray-300 text-sm max-w-xl">
            Full-stack integration featuring complete CRUD operations, real-time MongoDB persistence, loading states, and error handling.
          </p>
        </div>

        <button
          onClick={fetchTaskList}
          disabled={loadingTasks}
          className="px-4 py-2.5 bg-white dark:bg-inverse-surface border border-outline-variant dark:border-outline/40 text-on-surface dark:text-white hover:bg-surface-container rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm cursor-pointer transition-all disabled:opacity-50"
          title="Re-fetch tasks from database"
        >
          <span className={`material-symbols-outlined text-[18px] ${loadingTasks ? 'animate-spin' : ''}`}>
            refresh
          </span>
          {loadingTasks ? 'Fetching Tasks...' : 'Sync MongoDB'}
        </button>
      </div>

      {/* Main Grid: Task Form (Left) & Task List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* CREATE TASK FORM CARD */}
        <div className="lg:col-span-5 glass-card p-6 md:p-8 rounded-2xl shadow-sm dark:bg-inverse-surface/80 border border-outline-variant dark:border-outline/35 sticky top-24">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/50 dark:border-outline/25">
            <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary dark:text-[#5c8bee]">add_task</span>
              Create New Task
            </h3>
            {creatingTask && (
              <span className="text-xs text-primary font-mono animate-pulse">
                Creating task...
              </span>
            )}
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label htmlFor="task-title" className="block text-xs font-bold uppercase tracking-wider text-on-surface dark:text-gray-200 mb-1.5">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                id="task-title"
                type="text"
                required
                placeholder="e.g. Complete Practical 6 Integration"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-inverse-surface border border-outline-variant dark:border-outline/40 text-on-surface dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="task-desc" className="block text-xs font-bold uppercase tracking-wider text-on-surface dark:text-gray-200 mb-1.5">
                Description
              </label>
              <textarea
                id="task-desc"
                rows="3"
                placeholder="Detailed instructions or description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-inverse-surface border border-outline-variant dark:border-outline/40 text-on-surface dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all resize-none"
              ></textarea>
            </div>

            {/* Priority & Status Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="task-priority" className="block text-xs font-bold uppercase tracking-wider text-on-surface dark:text-gray-200 mb-1.5">
                  Priority
                </label>
                <select
                  id="task-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white dark:bg-inverse-surface border border-outline-variant dark:border-outline/40 text-on-surface dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label htmlFor="task-status" className="block text-xs font-bold uppercase tracking-wider text-on-surface dark:text-gray-200 mb-1.5">
                  Status
                </label>
                <select
                  id="task-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white dark:bg-inverse-surface border border-outline-variant dark:border-outline/40 text-on-surface dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={creatingTask}
              className="w-full py-3.5 px-6 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary-container transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {creatingTask ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating task...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  <span>Add Task to MongoDB</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* TASK LIST & CONTROLS SECTION */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SEARCH AND FILTER BAR */}
          <div className="bg-white dark:bg-inverse-surface p-4 rounded-2xl border border-outline-variant dark:border-outline/35 shadow-sm space-y-4">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant dark:text-gray-400 text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-surface-container-lowest dark:bg-inverse-surface/60 border border-outline-variant/60 dark:border-outline/30 text-on-surface dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 text-on-surface-variant hover:text-on-surface dark:text-gray-400 dark:hover:text-white"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
              {/* Status Tabs */}
              <div className="flex items-center gap-1 bg-surface-container-low dark:bg-inverse-surface/40 p-1 rounded-xl border border-outline-variant/40 dark:border-outline/20">
                {['all', 'pending', 'in-progress', 'completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant dark:text-gray-300 hover:text-on-surface dark:hover:text-white'
                    }`}
                  >
                    {st.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant dark:text-gray-400 font-medium">Priority:</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant/60 dark:border-outline/30 text-on-surface dark:text-white rounded-lg text-xs font-medium focus:outline-none"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* TASK LIST CONTENT */}
          {loadingTasks ? (
            /* INITIAL FETCH LOADING STATE */
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-inverse-surface rounded-2xl border border-outline-variant dark:border-outline/35 shadow-xs">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-on-surface-variant dark:text-gray-300 font-medium text-sm animate-pulse">
                Loading tasks from MongoDB database...
              </p>
            </div>
          ) : fetchError ? (
            /* FETCH ERROR STATE */
            <div className="p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 rounded-2xl text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[28px]">error</span>
              </div>
              <div>
                <h4 className="font-bold text-red-900 dark:text-red-200 text-lg">Backend Error</h4>
                <p className="text-sm text-red-700 dark:text-red-300 font-mono mt-1 bg-red-100/50 dark:bg-red-950/50 p-3 rounded-xl border border-red-200/50">
                  {fetchError}
                </p>
              </div>
              <button
                onClick={fetchTaskList}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                Retry Connecting
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            /* EMPTY TASKS STATE */
            <div className="text-center py-16 bg-white dark:bg-inverse-surface/40 rounded-2xl border border-dashed border-outline-variant dark:border-outline/30 p-8">
              <span className="material-symbols-outlined text-[48px] text-gray-400 dark:text-gray-600 mb-3">
                task
              </span>
              <h4 className="font-bold text-on-surface dark:text-white text-base">No tasks found</h4>
              <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-1 max-w-sm mx-auto">
                {tasks.length === 0
                  ? 'Your database is currently empty. Use the form on the left to add your first task.'
                  : 'No tasks match the active filter or search query.'}
              </p>
            </div>
          ) : (
            /* TASKS LIST CARDS */
            <div className="space-y-4">
              {filteredTasks.map((task) => {
                const currentStatus = task.status || (task.completed ? 'completed' : 'pending');

                // Color mappings
                const statusStyles = {
                  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
                  'in-progress': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
                  completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
                };

                const priorityStyles = {
                  high: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
                  medium: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
                  low: 'bg-gray-500/10 text-gray-600 dark:text-gray-300 border-gray-500/30',
                };

                const isDeleting = deletingTaskId === task._id;
                const isUpdating = updatingTaskId === task._id;

                return (
                  <div
                    key={task._id}
                    className={`bg-white dark:bg-inverse-surface p-6 rounded-2xl border border-outline-variant dark:border-outline/35 shadow-xs transition-all flex flex-col justify-between gap-4 relative overflow-hidden ${
                      currentStatus === 'completed' ? 'opacity-85' : ''
                    }`}
                  >
                    {/* Operation overlay spinner */}
                    {(isDeleting || isUpdating) && (
                      <div className="absolute inset-0 bg-white/70 dark:bg-inverse-surface/80 backdrop-blur-xs z-10 flex items-center justify-center gap-2 text-primary font-bold text-xs">
                        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        <span>{isDeleting ? 'Deleting task...' : 'Updating task...'}</span>
                      </div>
                    )}

                    <div>
                      {/* Badges & Date Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          {/* Status Badge */}
                          <span
                            className={`px-3 py-0.5 text-[11px] font-bold rounded-full border capitalize ${
                              statusStyles[currentStatus] || statusStyles.pending
                            }`}
                          >
                            {currentStatus.replace('-', ' ')}
                          </span>

                          {/* Priority Badge */}
                          <span
                            className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border capitalize ${
                              priorityStyles[task.priority] || priorityStyles.medium
                            }`}
                          >
                            {task.priority || 'medium'} priority
                          </span>
                        </div>

                        {/* Created timestamp */}
                        <span className="text-[11px] text-on-surface-variant dark:text-gray-400 font-mono">
                          {task.createdAt
                            ? new Date(task.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Persisted'}
                        </span>
                      </div>

                      {/* Title */}
                      <h4
                        className={`text-lg font-bold text-on-surface dark:text-white mb-2 ${
                          currentStatus === 'completed' ? 'line-through text-gray-400 dark:text-gray-400' : ''
                        }`}
                      >
                        {task.title}
                      </h4>

                      {/* Description */}
                      {task.description && (
                        <p className="text-xs text-on-surface-variant dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-outline-variant/40 dark:border-outline/20">
                      {/* Quick Status Toggle Button */}
                      <button
                        onClick={() => handleToggleStatus(task)}
                        className={`text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          currentStatus === 'completed'
                            ? 'text-amber-600 dark:text-amber-400 hover:underline'
                            : 'text-emerald-600 dark:text-emerald-400 hover:underline'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {currentStatus === 'completed' ? 'undo' : 'check_circle'}
                        </span>
                        {currentStatus === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                      </button>

                      {/* Edit & Delete Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(task)}
                          className="px-3 py-1.5 text-xs font-semibold text-primary dark:text-[#5c8bee] hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Edit Task"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          Edit
                        </button>

                        <button
                          onClick={() => promptDeleteModal(task)}
                          className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Delete Task"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* EDIT TASK MODAL */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-inverse-surface rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-outline-variant dark:border-outline/40 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/50 dark:border-outline/25">
              <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary dark:text-[#5c8bee]">edit_note</span>
                Edit Task
              </h3>
              <button
                onClick={closeEditModal}
                className="text-on-surface-variant hover:text-on-surface dark:text-gray-400 dark:hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface dark:text-gray-200 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-lowest dark:bg-inverse-surface/80 border border-outline-variant dark:border-outline/40 text-on-surface dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface dark:text-gray-200 mb-1.5">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-lowest dark:bg-inverse-surface/80 border border-outline-variant dark:border-outline/40 text-on-surface dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface dark:text-gray-200 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="w-full px-3 py-2.5 bg-surface-container-lowest dark:bg-inverse-surface/80 border border-outline-variant dark:border-outline/40 text-on-surface dark:text-white rounded-xl text-sm"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface dark:text-gray-200 mb-1.5">
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2.5 bg-surface-container-lowest dark:bg-inverse-surface/80 border border-outline-variant dark:border-outline/40 text-on-surface dark:text-white rounded-xl text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/40 dark:border-outline/20">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-5 py-2.5 text-xs font-bold text-on-surface-variant dark:text-gray-300 hover:bg-surface-container rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingTaskId === editingTask._id}
                  className="px-6 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {updatingTaskId === editingTask._id ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {taskToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-inverse-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant dark:border-outline/40 space-y-5 animate-fade-in text-center">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-[32px]">warning</span>
            </div>
            
            <div>
              <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white mb-2">
                Delete Task Confirmation
              </h3>
              <p className="text-xs text-on-surface-variant dark:text-gray-300">
                Are you sure you want to permanently delete this task?
              </p>
              <p className="text-sm font-semibold text-on-surface dark:text-white mt-2 font-mono bg-surface-container-low dark:bg-inverse-surface/60 p-2.5 rounded-xl border border-outline-variant/40 dark:border-outline/20">
                "{taskToDelete.title}"
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="px-5 py-2.5 text-xs font-bold text-on-surface-variant dark:text-gray-300 hover:bg-surface-container rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTask}
                disabled={deletingTaskId === taskToDelete._id}
                className="px-6 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {deletingTaskId === taskToDelete._id ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>Yes, Delete Task</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
