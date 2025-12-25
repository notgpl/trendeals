window.SUPABASE_URL = "https://ctiglwnyimjzocvuizdq.supabase.co";
window.SUPABASE_KEY = "YOUR_KEY";

window.supabaseClient = supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_KEY
);
