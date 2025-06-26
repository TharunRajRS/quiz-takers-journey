
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mcxnfpnskqtcppaaxtbx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jeG5mcG5za3F0Y3BwYWF4dGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4ODUwMTYsImV4cCI6MjA2NTQ2MTAxNn0.dUASXPUuVzPeTSV6BmBHCprN6AWYGssweE6aB1wuAfA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
