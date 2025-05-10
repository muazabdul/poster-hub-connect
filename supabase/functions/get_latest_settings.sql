
CREATE OR REPLACE FUNCTION public.get_latest_settings()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    jsonb_build_object(
      'id', id,
      'payment', payment,
      'appearance', appearance,
      'updated_at', updated_at,
      'created_at', created_at
    )
  FROM settings 
  ORDER BY updated_at DESC 
  LIMIT 1;
$$;
