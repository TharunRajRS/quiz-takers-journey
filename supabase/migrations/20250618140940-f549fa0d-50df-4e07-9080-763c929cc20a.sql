
-- Create a table to store exam results
CREATE TABLE IF NOT EXISTS public.exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  user_id UUID NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

-- Create policies for exam results (allowing all users to read and insert for demo purposes)
CREATE POLICY "Anyone can view exam results" ON public.exam_results FOR SELECT USING (true);
CREATE POLICY "Anyone can insert exam results" ON public.exam_results FOR INSERT WITH CHECK (true);
