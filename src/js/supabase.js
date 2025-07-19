// src/js/supabase.js
const client = supabase.createClient(
  'https://demgzkckfyecwlqhnagn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbWd6a2NrZnllY3dscWhuYWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTg1MzAsImV4cCI6MjA2ODA5NDUzMH0.TTezaMHYPoodQ3Ma6eiO7qox6dn4RF-mkAPqlePnUKc'
);

// Auth

async function loginEmail() {

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (!email || !password) return alert('Please fill all fields.');

  const { error } = await client.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Login error:', error.message);
    return alert(error.message);
  }

  window.location.href = 'tasks.html';

}

async function loginGoogle() {

  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/tasks.html' }
  });

  if (error) {
    console.error('Google login error:', error.message);
    return alert(error.message);
  }

}

async function handleSignup() {

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;

  if (!email || !password || !confirm) return alert('Please fill all fields.');
  if (password !== confirm) return alert('Passwords do not match.');

  const { error } = await client.auth.signUp({ email, password });

  if (error) {
    console.error('Signup error:', error.message);
    return alert(error.message);
  }

  alert('Account created. Please check your email to verify your account.');
  window.location.href = 'index.html';

}

async function logout() {

  await client.auth.signOut();
  window.location.href = 'index.html';

}

// User & Tasks

async function getCurrentUser() {

  const { data, error } = await client.auth.getUser();
  return error || !data.user ? null : data.user;

}

async function getTasks() {

  const { data } = await client
    .from('tasks')
    .select('*')
    .order('id', { ascending: false });

  return data || [];

}

async function createTask(title) {

  title = title.trim();
  
  if (!title) return false;

  const { error } = await client
    .from('tasks')
    .insert([{ title, done: false }]);

  return !error;

}

async function updateTask(id, done) {

  await client.from('tasks').update({ done }).eq('id', id);

}

async function deleteTask(id) {

  await client.from('tasks').delete().eq('id', id);

}
