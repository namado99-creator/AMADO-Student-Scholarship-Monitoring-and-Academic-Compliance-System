
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iyatlzlnrlkwetfmmgqn.supabase.co';
const supabaseAnonKey = 'sb_publishable_s1G7KoTZy5zYN74kgrtPEQ_b_R82vMu';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
