# Supabase Database Setup

## Running Migrations

To apply the database migrations, you have two options:

### Option 1: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref ifuttctsjfogiaujjets
   ```

3. Run migrations:
   ```bash
   supabase db push
   ```

### Option 2: Manual SQL Execution

Run each migration file in order via the Supabase Dashboard:

1. Go to https://supabase.com/dashboard/project/ifuttctsjfogiaujjets/sql
2. Execute each migration file in order:
   - `20241222000001_create_users_profile.sql`
   - `20241222000002_create_learning_history.sql`
   - `20241222000003_create_streaks.sql`
   - `20241222000004_create_badges.sql`
   - `20241222000005_create_family.sql`

## Database Schema

### Tables

- **profiles**: User profile data (extends auth.users)
- **learning_history**: Question attempts and AI evaluations
- **streaks**: User learning streak tracking
- **user_badges**: Earned badges
- **family_members**: Parent-child relationships
- **invite_codes**: Family invite codes

### Row Level Security (RLS)

All tables have RLS enabled. Users can only access their own data.

## Authentication Setup

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Email provider
3. Configure email templates as needed
4. (Optional) Enable Google/Apple OAuth providers

## Environment Variables

The app uses these from `src/utils/supabase/info.tsx`:
- `projectId`: Your Supabase project ID
- `publicAnonKey`: Your Supabase anon key
