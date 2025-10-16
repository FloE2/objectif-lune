import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zykxfekqyjugaznmebwy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5a3hmZWtxeWp1Z2F6bm1lYnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjU3MDEsImV4cCI6MjA3NjIwMTcwMX0.bf8Zm2JIRyhRkgjsutyMu8Zsz_tGN4-2mLfiEXYXgL0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 🚀 Déploiement sur Vercel

### 1. Préparer votre projet

1. Créez un compte GitHub si vous n'en avez pas
2. Depuis StackBlitz, cliquez sur "Connect Repository" pour lier à GitHub
3. Créez un nouveau repository

### 2. Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous avec GitHub
2. Cliquez sur "New Project"
3. Importez votre repository GitHub
4. Ajoutez les variables d'environnement :
   - `VITE_SUPABASE_URL` = votre URL Supabase
   - `VITE_SUPABASE_ANON_KEY` = votre clé Supabase
5. Cliquez sur "Deploy"

### 3. Variables d'environnement

Créez un fichier `.env` dans StackBlitz (ne pas commiter sur GitHub) :
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key