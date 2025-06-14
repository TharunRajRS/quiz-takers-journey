
-- Enable RLS on the existing exam_results table if not already enabled
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

-- Create policies for exam_results table to allow users to insert their own results
-- and allow viewing all results (you can modify this based on your needs)
CREATE POLICY "Users can insert their own exam results" ON public.exam_results
  FOR INSERT WITH CHECK (true); -- Allow anyone to insert results

CREATE POLICY "Allow viewing all exam results" ON public.exam_results
  FOR SELECT USING (true); -- Allow viewing all results for analytics

-- Create an index for better performance when querying by completion date
CREATE INDEX IF NOT EXISTS idx_exam_results_completed_at ON public.exam_results(completed_at DESC);

-- Create an index for better performance when querying by score
CREATE INDEX IF NOT EXISTS idx_exam_results_score ON public.exam_results(score DESC);
