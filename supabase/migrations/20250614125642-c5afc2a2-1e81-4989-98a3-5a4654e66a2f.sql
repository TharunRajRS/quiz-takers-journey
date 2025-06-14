
-- Create a table for meetup groups
CREATE TABLE public.meetup_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for group members
CREATE TABLE public.group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.meetup_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for user preferences
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.meetup_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  preferred_dates DATE[] NOT NULL DEFAULT '{}',
  preferred_times TEXT[] NOT NULL DEFAULT '{}',
  preferred_locations TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for meetup suggestions
CREATE TABLE public.meetup_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.meetup_groups(id) ON DELETE CASCADE,
  suggested_date DATE NOT NULL,
  suggested_time TEXT NOT NULL,
  suggested_location TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.meetup_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetup_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS policies for meetup_groups
CREATE POLICY "Anyone can view meetup groups" ON public.meetup_groups FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create groups" ON public.meetup_groups FOR INSERT WITH CHECK (true);
CREATE POLICY "Group creators can update their groups" ON public.meetup_groups FOR UPDATE USING (true);

-- RLS policies for group_members
CREATE POLICY "Anyone can view group members" ON public.group_members FOR SELECT USING (true);
CREATE POLICY "Anyone can join groups" ON public.group_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Members can leave groups" ON public.group_members FOR DELETE USING (true);

-- RLS policies for user_preferences
CREATE POLICY "Anyone can view preferences" ON public.user_preferences FOR SELECT USING (true);
CREATE POLICY "Users can add their preferences" ON public.user_preferences FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their preferences" ON public.user_preferences FOR UPDATE USING (true);

-- RLS policies for meetup_suggestions
CREATE POLICY "Anyone can view suggestions" ON public.meetup_suggestions FOR SELECT USING (true);
CREATE POLICY "Anyone can create suggestions" ON public.meetup_suggestions FOR INSERT WITH CHECK (true);
