-- Fix search_path warnings for database functions
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.create_notification(uuid, text, text, text, uuid, uuid) SET search_path = public;