// supabase.js
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

export const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// --- AUTH ---
export async function loginEmail() {
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value
  if (!email || !password) return alert('Required fields')
  const { error } = await client.auth.signInWithPassword({ email, password })
  if (error) return alert(error.message)
  window.location.href = 'tasks.html'
}

export async function loginGoogle() {
  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/tasks.html` }
  })
  if (error) console.error(error)
}

export async function handleSignup() {
  const email = document.getElementById('email').value.trim()
  const pwd = document.getElementById('password').value
  const confirm = document.getElementById('confirm').value
  if (!email || !pwd || !confirm) return alert('Please fill all fields')
  if (pwd !== confirm) return alert('Passwords do not match')
  const { error } = await client.auth.signUp({ email, password: pwd })
  if (error) return alert(error.message)
  alert('Account created. Vérifie ton email.')
  window.location.href = 'index.html'
}

export async function logout() {
  await client.auth.signOut()
  window.location.href = 'index.html'
}

export async function getCurrentUser() {
  const { data, error } = await client.auth.getUser()
  return error || !data.user ? null : data.user
}

// --- TASKS CRUD ---
export async function getTasks() {
  const { data, error } = await client.from('tasks').select('*').order('id', { ascending: false })
  return error ? [] : data
}

export async function createTask(title) {
  const { error } = await client.from('tasks').insert([{ title, done: false }])
  return !error
}

export async function updateTask(id, updates) {
  const { error } = await client.from('tasks').update(updates).eq('id', id)
  return !error
}

export async function deleteTask(id) {
  const { error } = await client.from('tasks').delete().eq('id', id)
  return !error
}
