import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from "@clerk/nextjs/server"
import { supabaseAdmin } from '@/lib/db/supabase'

interface UserWebhookEvent {
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    primary_email_address_id?: string;
    object?: string;
    deleted?: boolean;
    first_name?: string;
    last_name?: string;
  };
  object: string;
  type: string;
}

export async function POST(req: Request) {
  try {
    // Get the headers
    const headerPayload = headers();

    // If there are no headers, error out
    if (!headerPayload.get("svix-id") || !headerPayload.get("svix-timestamp") || !headerPayload.get("svix-signature")) {
      return new Response('Error occurred -- no svix headers', {
        status: 400
      })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your webhook secret
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return new Response('Webhook secret not configured', { status: 500 });
    }

    const wh = new Webhook(webhookSecret);
    let evt: UserWebhookEvent;

    // Verify the webhook
    try {
      evt = wh.verify(body, {
        "svix-id": headerPayload.get("svix-id")!,
        "svix-timestamp": headerPayload.get("svix-timestamp")!,
        "svix-signature": headerPayload.get("svix-signature")!,
      }) as UserWebhookEvent;
    } catch (err) {
      return new Response('Error occurred during webhook verification', {
        status: 400
      });
    }

    // Process the webhook
    const eventType = evt.type;

    try {
      // Test Supabase connection first
      const { error: testError } = await supabaseAdmin
        .from('users')
        .select('count')
        .limit(1);
      
      if (testError) {
        return new Response('Database connection error', { status: 500 });
      }

      switch (eventType) {
        case 'user.created': {
          const email = evt.data.email_addresses?.[0]?.email_address;
          if (!email) {
            return new Response('No email address found', { status: 400 });
          }

          const username = email.split('@')[0] || `user_${evt.data.id}`;

          // Create user in Supabase
          const { error: userError } = await supabaseAdmin
            .from('users')
            .insert({
              id: evt.data.id,
              email,
              auth_provider: evt.data.primary_email_address_id ? 'email' : 'oauth',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (userError) {
            return new Response(`Error creating user: ${userError.message}`, { status: 500 });
          }

          // Create profile
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
              user_id: evt.data.id,
              username,
              first_name: evt.data.first_name || '',
              last_name: evt.data.last_name || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (profileError) {
            // Clean up user if profile creation fails
            await supabaseAdmin
              .from('users')
              .delete()
              .eq('id', evt.data.id);
            return new Response(`Error creating profile: ${profileError.message}`, { status: 500 });
          }

          return new Response('User created successfully', { status: 200 });
        }

        case 'user.deleted': {
          // Due to foreign key constraints, deleting the user will cascade delete the profile
          const { error } = await supabaseAdmin
            .from('users')
            .delete()
            .eq('id', evt.data.id);

          if (error) {
            return new Response(`Error deleting user: ${error.message}`, { status: 500 });
          }

          return new Response('User deleted successfully', { status: 200 });
        }

        case 'user.updated': {
          const email = evt.data.email_addresses?.[0]?.email_address;

          // Update user email if changed
          if (email) {
            const { error: userError } = await supabaseAdmin
              .from('users')
              .update({ 
                email,
                updated_at: new Date().toISOString(),
              })
              .eq('id', evt.data.id);

            if (userError) {
              return new Response(`Error updating user: ${userError.message}`, { status: 500 });
            }
          }

          // Update profile
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({
              first_name: evt.data.first_name || '',
              last_name: evt.data.last_name || '',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', evt.data.id);

          if (profileError) {
            return new Response(`Error updating profile: ${profileError.message}`, { status: 500 });
          }

          return new Response('User updated successfully', { status: 200 });
        }

        case 'session.created':
          return new Response('Session created event acknowledged', { status: 200 });

        default:
          return new Response('Webhook received', { status: 200 });
      }
    } catch (error) {
      return new Response('Internal server error', { status: 500 });
    }
  } catch (err) {
    return new Response('Internal server error', { status: 500 });
  }
}