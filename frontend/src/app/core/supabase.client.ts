import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://cnavxvtsctqobgewxndw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuYXZ4dnRzY3Rxb2JnZXd4bmR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MTk2ODAsImV4cCI6MjA5MTM5NTY4MH0.lGLuudhJZ8JEDucHm3Pehmy5kKbGx3zuPkq_tR7xmNs'
);