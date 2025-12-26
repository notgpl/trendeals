const SUPABASE_URL = "https://ctiglwnyimjzocvuizdq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aWdsd255aW1qem9jdnVpemRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNDI4MTMsImV4cCI6MjA4MTYxODgxM30.eW5nl5yCXnz0V0iya6cZCMj4Pgy05vhClUQ4pLfwYNI";

window.supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
