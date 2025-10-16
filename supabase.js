import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zykxfekqyjugaznmebwy.supabase.com'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5a3hmZWtxeWp1Z2F6bm1lYnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjU3MDEsImV4cCI6MjA3NjIwMTcwMX0.bf8Zm2JIRyhRkgjsutyMu8Zsz_tGN4-2mLfiEXYXgL0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```