-- Add price column to products table
ALTER TABLE public.products
ADD COLUMN price numeric(10, 2) DEFAULT NULL;