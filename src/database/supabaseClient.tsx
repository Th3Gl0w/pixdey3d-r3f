import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = "https://rgwuhurybooiqejowtyt.supabase.co";
// const supabaseAnonKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnd3VodXJ5Ym9vaXFlam93dHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4NDYxODIsImV4cCI6MjAxNDQyMjE4Mn0.UscB77rYU97qKJmCCWEz-thmWg-DsZ2zpe4ts68z20E";

// export const supabase_ = createClient(supabaseUrl, supabaseAnonKey);
export const supabase = createClient(
  "https://wlngkylgkjzsjkegadjw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbmdreWxna2p6c2prZWdhZGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1MDU4NjcsImV4cCI6MjAxNzA4MTg2N30.jG9LVT6BEtgR6-WV9N8GWnj1L3vwVP21aQCR__yqz0c"
);
