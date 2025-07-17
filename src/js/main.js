// main.js
import '../css/input.css'
import * as api from './supabase.js'

Object.assign(window, api)

window.addEventListener('DOMContentLoaded', async () => {
  const user = await api.getCurrentUser()
  const page = location.pathname.split('/').pop() || 'index.html'

  if ((page === 'index.html' || page === '') && user) {
    return location.replace('tasks.html')
  }
  if (page === 'tasks.html') {
    if (!user) return location.replace('index.html')
    document.getElementById('user-email').textContent = user.email || ''
    await loadTasks()
  }
})

async function loadTasks() {
  const tasks = await api.getTasks()
  const list = document.getElementById('task-list')
  list.innerHTML = ''
  for (const t of tasks) {
    const li = document.createElement('li')
    li.className = 'flex items-center justify-between px-4 py-2 rounded-lg bg-neutral-900'
    li.innerHTML = `
      <div class="flex items-center gap-2">
        <input type="checkbox" ${t.done ? 'checked' : ''} class="accent-pink-500 w-5 h-5 rounded"/>
        <span class="${t.done ? 'line-through' : ''}">${t.title}</span>
      </div>
      <button>Delete</button>
    `
    li.querySelector('input').onchange = async e => {
      await api.updateTask(t.id, { done: e.target.checked })
      await loadTasks()
    }
    li.querySelector('button').onclick = async () => {
      await api.deleteTask(t.id)
      await loadTasks()
    }
    list.appendChild(li)
  }
}

window.handleAddTask = async () => {
  const title = document.getElementById('task-title').value.trim()
  if (!title) return
  await api.createTask(title)
  document.getElementById('task-title').value = ''
  await loadTasks()
}
