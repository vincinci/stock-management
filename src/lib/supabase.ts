import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://duqdxrdbzdaljcjgzglq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1cWR4cmRiemRhbGpjamd6Z2xxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMzM0MTEsImV4cCI6MjA1NTYwOTQxMX0.TnkkzxywVzQ0QFTShPLOatBQx1r7Fq4QejGEMOAQrRM';

export const supabase = createClient(supabaseUrl, supabaseKey);
