import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qlduhmcvgzpgsefayyhb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsZHVobWN2Z3pwZ3NlZmF5eWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxOTk2MzMsImV4cCI6MjA3OTc3NTYzM30.1aqa1hr6gUMJ0kQMN_o6tPpgrsKyGbAehuk_JuvSv6E';

export const supabase = createClient(supabaseUrl, supabaseKey);