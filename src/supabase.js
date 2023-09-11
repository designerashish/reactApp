import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jilbezjtoitpjvxdbpyf.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppbGJlemp0b2l0cGp2eGRicHlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM2MjI3MzEsImV4cCI6MjAwOTE5ODczMX0.A0PwsSvXbRAqAkrhTZBoly02PEonGPRxA8iq4BoHe7I";
const supabase = createClient(supabaseUrl, supabaseKey);


export default supabase;