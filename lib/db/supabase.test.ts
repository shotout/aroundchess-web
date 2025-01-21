import { supabaseAdmin } from './supabase';

async function testConnection() {
  try {
    // Get all users
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        profiles (*)
      `);

    if (usersError) {
      process.exit(1);
    }

    if (users && users.length > 0) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    process.exit(1);
  }
}

testConnection();
