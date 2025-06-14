-- Add detailed species information fields to posts table
ALTER TABLE public.posts 
ADD COLUMN scientific_name TEXT,
ADD COLUMN category TEXT,
ADD COLUMN confidence TEXT,
ADD COLUMN habitat TEXT,
ADD COLUMN diet TEXT,
ADD COLUMN behavior TEXT,
ADD COLUMN conservation_status TEXT,
ADD COLUMN interesting_facts TEXT,
ADD COLUMN identification_notes TEXT;