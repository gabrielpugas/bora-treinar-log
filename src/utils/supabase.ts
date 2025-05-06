import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ilsdawyobabyamskkcbu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsc2Rhd3lvYmFieWFtc2trY2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NTY3NDEsImV4cCI6MjA2MjEzMjc0MX0.DvjhhPGPYZMqv97I3yHFt4h9Mgq17WqmDdpaI1GS7NU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);