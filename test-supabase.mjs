import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fqqihbfpomdyxaixaris.supabase.co';
const supabaseKey = 'sb_publishable_j1dATrE0NtAUcRNBKHmzxA_5CmWl-gx';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase
    .from('community_replies')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('Data:', data);
    if (data.length > 0) {
      console.log('Columns:', Object.keys(data[0]));
    } else {
      console.log('No data found, trying an insert to test if parent_id exists...');
      const { error: insertError } = await supabase
        .from('community_replies')
        .insert({ post_id: 'test', body: 'test', author: 'test', parent_id: 'test' });
      console.log('Insert error:', insertError);
    }
  }
}

checkSchema();
