-- Create educational posts table for animal/plant information
CREATE TABLE public.educational_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- 'animals', 'birds', 'plants', 'facts'
  post_type TEXT NOT NULL, -- 'did-you-know', 'interesting-fact', 'how-to', 'where-to-find'
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.educational_posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read educational posts (public content)
CREATE POLICY "Educational posts are viewable by everyone" 
ON public.educational_posts 
FOR SELECT 
USING (true);

-- Create educational post likes table
CREATE TABLE public.educational_post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.educational_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS for likes
ALTER TABLE public.educational_post_likes ENABLE ROW LEVEL SECURITY;

-- Policies for likes
CREATE POLICY "Users can view all educational post likes" 
ON public.educational_post_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can like educational posts" 
ON public.educational_post_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes" 
ON public.educational_post_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create educational post comments table
CREATE TABLE public.educational_post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.educational_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for comments
ALTER TABLE public.educational_post_comments ENABLE ROW LEVEL SECURITY;

-- Policies for comments
CREATE POLICY "Users can view all educational post comments" 
ON public.educational_post_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create comments" 
ON public.educational_post_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.educational_post_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.educational_post_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at on educational_posts
CREATE TRIGGER update_educational_posts_updated_at
BEFORE UPDATE ON public.educational_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for updated_at on educational_post_comments
CREATE TRIGGER update_educational_post_comments_updated_at
BEFORE UPDATE ON public.educational_post_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample educational posts
INSERT INTO public.educational_posts (title, content, category, post_type, tags) VALUES
('Do you know where polar bears live?', 'Polar bears primarily live in the Arctic regions of Alaska, Canada, Russia, Greenland, and Norway. They spend most of their time on sea ice, which they use as a platform for hunting seals. These magnificent creatures are perfectly adapted to one of Earth''s most extreme environments, with thick fur and a layer of blubber to keep them warm in temperatures that can drop to -40°F (-40°C).', 'animals', 'did-you-know', ARRAY['polar-bears', 'arctic', 'habitat']),

('Interesting fact: Octopuses have three hearts!', 'Most people don''t know that octopuses have three hearts! Two hearts pump blood to the gills, while the third pumps blood to the rest of the body. Even more fascinating - the main heart stops beating when they swim, which is why octopuses prefer crawling over swimming to avoid exhaustion. They also have blue blood due to a copper-based protein called hemocyanin, which is more efficient than our iron-based hemoglobin in cold, low-oxygen environments.', 'animals', 'interesting-fact', ARRAY['octopus', 'marine-life', 'anatomy']),

('How to grow beautiful tulips in your garden', 'Growing tulips is easier than you think! Plant tulip bulbs in fall, about 6-8 inches deep and 4-6 inches apart in well-draining soil. Choose a sunny to partially shaded location. Tulips need a cold winter period (12-16 weeks below 50°F) to bloom properly. Water them well after planting, then let winter rain do the work. In spring, you''ll be rewarded with gorgeous blooms! Pro tip: Plant different varieties for extended blooming periods from early to late spring.', 'plants', 'how-to', ARRAY['tulips', 'gardening', 'flowers', 'spring']),

('Where to find sparrows in your neighborhood', 'House sparrows are one of the most common birds worldwide, but they''re becoming less common in some areas. Look for them near human settlements - they love parks, gardens, cafes with outdoor seating, and residential areas. They often gather in flocks and are quite social. Best spots to observe them: bird feeders, outdoor restaurants (they''ll hop around for crumbs), hedgerows, and anywhere with dense shrubs for nesting. Early morning and late afternoon are prime sparrow-watching times!', 'birds', 'where-to-find', ARRAY['sparrows', 'birdwatching', 'urban-wildlife']),

('Did you know honeybees communicate through dancing?', 'Honeybees perform a "waggle dance" to communicate the location of food sources to their hive mates! The angle of their dance indicates direction relative to the sun, while the duration tells other bees how far to fly. A dance lasting one second means the food source is about 1,000 meters away. This incredible form of communication allows the entire colony to efficiently gather nectar and pollen. The discovery of this bee language earned Karl von Frisch a Nobel Prize!', 'animals', 'did-you-know', ARRAY['bees', 'communication', 'insects', 'science']),

('Interesting fact: Trees can live for thousands of years', 'The oldest known living tree is a Great Basin bristlecone pine in California, estimated to be over 5,000 years old! These ancient trees survive in harsh, high-altitude conditions where few other plants can thrive. Some trees, like the Ginkgo, are called "living fossils" because they''ve remained virtually unchanged for millions of years. Trees can live so long because they grow in a modular way - if one part dies, other parts can continue living and growing.', 'plants', 'interesting-fact', ARRAY['trees', 'longevity', 'ancient', 'nature']),

('How to attract butterflies to your garden', 'Create a butterfly paradise by planting native flowering plants that bloom throughout the growing season! Butterflies love bright colors, especially red, orange, yellow, and purple flowers. Plant flowers in clusters rather than scattered individual plants. Essential plants include: butterfly bush, lantana, marigolds, zinnias, and native wildflowers. Also provide shallow water sources like birdbaths with stones for landing spots, and avoid pesticides. Butterflies also need host plants where they can lay eggs - research which ones are native to your area!', 'plants', 'how-to', ARRAY['butterflies', 'gardening', 'pollinator-garden', 'native-plants']),

('Where to spot cardinals year-round', 'Northern cardinals are non-migratory birds, so you can enjoy their bright red beauty all year long! Look for them in woodland edges, overgrown fields, hedgerows, and suburban areas with trees and shrubs. They prefer areas with dense cover for nesting and protection. Cardinals are most active during early morning and late afternoon. In winter, they''re easier to spot against snowy backgrounds. Put up a bird feeder with sunflower seeds - cardinals love them and will become regular visitors to your yard!', 'birds', 'where-to-find', ARRAY['cardinals', 'birdwatching', 'year-round', 'backyard-birds']);

-- Function to update likes count when likes are added/removed
CREATE OR REPLACE FUNCTION update_educational_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.educational_posts 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.educational_posts 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for likes count
CREATE TRIGGER trigger_update_educational_post_likes_count_insert
  AFTER INSERT ON public.educational_post_likes
  FOR EACH ROW EXECUTE FUNCTION update_educational_post_likes_count();

CREATE TRIGGER trigger_update_educational_post_likes_count_delete
  AFTER DELETE ON public.educational_post_likes
  FOR EACH ROW EXECUTE FUNCTION update_educational_post_likes_count();

-- Function to update comments count
CREATE OR REPLACE FUNCTION update_educational_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.educational_posts 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.educational_posts 
    SET comments_count = comments_count - 1 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for comments count
CREATE TRIGGER trigger_update_educational_post_comments_count_insert
  AFTER INSERT ON public.educational_post_comments
  FOR EACH ROW EXECUTE FUNCTION update_educational_post_comments_count();

CREATE TRIGGER trigger_update_educational_post_comments_count_delete
  AFTER DELETE ON public.educational_post_comments
  FOR EACH ROW EXECUTE FUNCTION update_educational_post_comments_count();