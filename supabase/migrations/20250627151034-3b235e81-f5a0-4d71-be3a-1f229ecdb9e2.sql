
-- Make user_id nullable since we're not using authentication
ALTER TABLE public.exam_results 
ALTER COLUMN user_id DROP NOT NULL;

-- Add a default value for user_id to handle existing constraint
ALTER TABLE public.exam_results 
ALTER COLUMN user_id SET DEFAULT NULL;
