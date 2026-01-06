-- Add garden location columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN garden_latitude DOUBLE PRECISION DEFAULT NULL,
ADD COLUMN garden_longitude DOUBLE PRECISION DEFAULT NULL;