
-- Create function to get the latest settings
CREATE OR REPLACE FUNCTION public.get_latest_settings()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT row_to_json(s)::jsonb
  FROM (
    SELECT * FROM settings 
    ORDER BY updated_at DESC 
    LIMIT 1
  ) s;
$$;

-- Create function to update settings
CREATE OR REPLACE FUNCTION public.update_settings(settings_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM settings WHERE id = (settings_data->>'id')::uuid) THEN
    UPDATE settings
    SET 
      payment = COALESCE(settings_data->'payment', payment),
      appearance = COALESCE(settings_data->'appearance', appearance),
      updated_at = now()
    WHERE id = (settings_data->>'id')::uuid;
  ELSE
    INSERT INTO settings (payment, appearance)
    VALUES (
      settings_data->'payment',
      settings_data->'appearance'
    );
  END IF;
END;
$$;
