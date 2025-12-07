// src/config/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkbvpweelhqhhzgckoau.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYnZwd2VlbGhxaGh6Z2Nrb2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTQwMjYsImV4cCI6MjA3OTk5MDAyNn0.lDAMDscgqnReBtYB-3XX5g8fMc0nz3TQbgR55plhhlo'


if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for frontend (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service client for backend operations (uses service_role key)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;