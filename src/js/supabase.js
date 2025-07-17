// supabase.js

const client = supabase.createClient(
  'https://demgzkckfyecwlqhnagn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbWd6a2NrZnllY3dscWhuYWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTg1MzAsImV4cCI6MjA2ODA5NDUzMH0.TTezaMHYPoodQ3Ma6eiO7qox6dn4RF-mkAPqlePnUKc'
);

// --- AUTH ---

async function loginEmail() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) return alert("Required fields");

  const { error } = await client.auth.signInWithPassword({ email, password });

  if (error) return alert(error.message);
  window.location.href = "tasks.html";
}

async function loginGoogle() {
  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/tasks.html`,
    }
  });

  if (error) console.error("Error while trying to log in with Google:", error);
}

async function signupEmail() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) return alert("Required fields");

  const { error } = await client.auth.signUp({ email, password });

  if (error) return alert(error.message);
  alert("Sign up completed. An email will be send to you in a few seconds.");
}

async function signupEmail(email, password) {
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) {
    console.error('SIGNUP:', error);
    alert(error.message);
  }
  return { data, error };
}

async function logout() {
  await client.auth.signOut();
  window.location.href = "index.html";
}

async function getCurrentUser() {
  const { data, error } = await client.auth.getUser();
  return error || !data.user ? null : data.user;
}

// --- TASKS CRUD ---

async function getTasks() {
  const { data, error } = await client
    .from('tasks')
    .select('*')
    .order('id', { ascending: false });

  return error ? [] : data;
}

async function createTask(title) {
  if (!title) return null;

  const { error } = await client
    .from('tasks')
    .insert([{ title, done: false }]);

  return error ? null : true;
}

async function updateTask(id, updates) {
  const { error } = await client
    .from('tasks')
    .update(updates)
    .eq('id', id);

  return !error;
}

async function deleteTask(id) {
  const { error } = await client
    .from('tasks')
    .delete()
    .eq('id', id);

  return !error;
}
