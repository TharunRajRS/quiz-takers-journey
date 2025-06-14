
-- Remove the foreign key constraint that's causing the issue
ALTER TABLE public.exam_results DROP CONSTRAINT IF EXISTS exam_results_user_id_fkey;

-- Make user_id just a regular UUID column without foreign key reference
-- (no changes needed to the column itself, just removing the constraint)
