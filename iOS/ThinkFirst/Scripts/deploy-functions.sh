#!/bin/bash

# Deploy Supabase Edge Functions
# Make sure you have Supabase CLI installed: npm install -g supabase

echo "Deploying ThinkFirst Edge Functions..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Login to Supabase (if not already logged in)
echo "Make sure you're logged in to Supabase CLI..."
supabase login

# Set your project reference
echo "Enter your Supabase project reference:"
read -r PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
    echo "Project reference is required"
    exit 1
fi

# Link to project
supabase link --project-ref "$PROJECT_REF"

# Deploy functions
echo "Deploying evaluate function..."
supabase functions deploy evaluate --project-ref "$PROJECT_REF"

echo "Deploying update-streak function..."
supabase functions deploy update-streak --project-ref "$PROJECT_REF"

echo "Deploying check-badges function..."
supabase functions deploy check-badges --project-ref "$PROJECT_REF"

echo "Deploying increment-questions function..."
supabase functions deploy increment-questions --project-ref "$PROJECT_REF"

echo "All functions deployed successfully!"
echo ""
echo "Next steps:"
echo "1. Update iOS/ThinkFirst/Services/SupabaseConfig.swift with your project URL and anon key"
echo "2. Run the database schema in your Supabase SQL editor"
echo "3. Set up authentication in your Supabase dashboard"
echo "4. Configure RLS policies if needed"