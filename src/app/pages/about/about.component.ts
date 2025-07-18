import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}

/*
Before running this project you need to do the following in Supabase
1.Create a new project in supabase and enable Sign in Google: 
For this first create a project in Google Cloud Console and configure OAuth.
You may refer https://supabase.com/docs/guides/auth/social-login/auth-google#configure-your-services-id
2. Create data table chat_messages for following schema
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.chat_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text,
  content text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT chat_messages_pkey PRIMARY KEY (id),
  CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);  
and create following two policies on chat_messages table
a)
alter policy "Users can insert their own messages"
on "public"."chat_messages"
to public
with check (
  (auth.uid() = user_id)
);
b) 
alter policy "Users can read their own messages"
on "public"."chat_messages"
to public
using (
  (auth.uid() = user_id)
);
3.Add following edge function

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js';
// Log that the server has started (visible in Supabase Edge Function logs)
console.info('Edge Function: Chat Completion Server Started');
// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:4200',//change this to your url
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
// Deno.serve handles incoming HTTP requests
Deno.serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  // Log the incoming request details for debugging
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  // --- 1. Initialize Supabase Clients ---
  // Client for user authentication (uses the incoming Authorization header)
  // This client respects Row Level Security (RLS)
  const supabaseAuthClient = createClient(Deno.env.get('PROJECT_URL') || '', Deno.env.get('PROJECT_ANON_KEY') || '', {
    global: {
      headers: {
        'Authorization': req.headers.get('Authorization') || '',
        'Content-Type': 'application/json'
      }
    }
  });
  // Client for database writes using the Service Role Key
  // This client bypasses Row Level Security (RLS) and has full access.
  // Ensure SUPABASE_SERVICE_ROLE_KEY is set in your Edge Function secrets.
  const supabaseServiceRoleClient = createClient(Deno.env.get('PROJECT_URL') || '', Deno.env.get('PROJECT_SERVICE_ROLE_KEY') || '');
  // --- 2. Authenticate User ---
  // We use the supabaseAuthClient here to get the currently authenticated user.
  const { data: { user }, error: userError } = await supabaseAuthClient.auth.getUser();
  if (userError || !user) {
    console.error('Authentication Error:', userError?.message || 'User not found or invalid token.');
    return new Response(JSON.stringify({
      error: 'Unauthorized access. Please provide a valid Supabase JWT.'
    }), {
      status: 401,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
  console.log('User authenticated:', user.id);
  const user_id = user.id;
  // --- 3. Parse Request Body and Validate Input ---
  let message;
  try {
    const requestBody = await req.json();
    const { message: rawMessage } = requestBody;
    if (typeof rawMessage !== 'string' || !rawMessage.trim()) {
      console.error('Validation Error: "message" is missing or not a non-empty string.');
      return new Response(JSON.stringify({
        error: 'The "message" field is required and must be a non-empty string.'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    message = rawMessage.trim();
  } catch (e) {
    console.error('JSON Parsing or Input Error:', e.message);
    return new Response(JSON.stringify({
      error: `Invalid request body. Ensure it's valid JSON with a 'message' field. Error: ${e.message}`
    }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
  console.log('Received user message (truncated):', message.substring(0, 100) + (message.length > 100 ? '...' : ''));
  // --- 4. Save User's Message to Database ---
  // Using supabaseServiceRoleClient to ensure message is saved regardless of user RLS.
  try {
    const { error: insertUserMessageError } = await supabaseServiceRoleClient.from('chat_messages').insert({
      role: 'user',
      content: message,
      user_id
    });
    if (insertUserMessageError) {
      console.error('Database Error: Failed to save user message:', insertUserMessageError.message);
    // Decide if this should return a 500 error or just log and continue.
    // For now, we log and proceed to try to get an OpenAI response.
    } else {
      console.log('User message successfully saved to "chat_messages" table.');
    }
  } catch (e) {
    console.error('Unexpected error while saving user message:', e.message);
  }
  // --- 5. Call OpenAI API ---
  console.log('Attempting to call OpenAI API...');
  let openaiData;
  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('Environment Error: OPENAI_API_KEY is not set.');
      return new Response(JSON.stringify({
        error: 'OpenAI API key not configured on the server.'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          // You might want to fetch previous messages from your DB here
          // to provide conversation context to OpenAI.
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    if (!openaiRes.ok) {
      const errorDetail = await openaiRes.text();
      console.error(`OpenAI API responded with error status ${openaiRes.status}: ${errorDetail}`);
      return new Response(JSON.stringify({
        error: `Failed to get response from OpenAI. Status: ${openaiRes.status}. Details: ${errorDetail}`
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    openaiData = await openaiRes.json();
    console.log('OpenAI Raw Response (truncated):', JSON.stringify(openaiData, null, 2).substring(0, 500) + '...');
  } catch (e) {
    console.error('Error during OpenAI API call:', e.message);
    return new Response(JSON.stringify({
      error: `An unexpected error occurred while contacting OpenAI: ${e.message}`
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
  const assistantMessage = openaiData.choices?.[0]?.message?.content?.trim();
  if (!assistantMessage) {
    console.error('OpenAI Response Parsing Error: Assistant message content not found in choices.');
    return new Response(JSON.stringify({
      error: 'OpenAI did not return a valid assistant message.'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
  console.log('Assistant message successfully extracted.');
  // --- 6. Save Assistant's Message to Database ---
  // Using supabaseServiceRoleClient to ensure message is saved regardless of user RLS.
  try {
    const { error: insertAssistantMessageError } = await supabaseServiceRoleClient.from('chat_messages').insert({
      role: 'assistant',
      content: assistantMessage,
      user_id
    });
    if (insertAssistantMessageError) {
      console.error('Database Error: Failed to save assistant message:', insertAssistantMessageError.message);
    } else {
      console.log('Assistant message successfully saved to "chat_messages" table.');
    }
  } catch (e) {
    console.error('Unexpected error while saving assistant message:', e.message);
  }
  // --- 7. Return Assistant Response to Client ---
  return new Response(JSON.stringify({
    content: assistantMessage
  }), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
});

create secret keys for PROJECT_URL(supabase project url), PROJECT_ANON_KEY (supabase anon key),
PROJECT_SERVICE_ROLE_KEY (supabase service role secret key),OPENAI_API_KEY (openai api key)

and in this Angular project
create environment files and add those keys with values.
supabaseUrl (supabase project url)
supabaseKey (supabase anon key)
Add your newly created supabase edge function url in chat.component.ts line 46 (to call edge function from our Angular project).

Thank you!

Created by Gayan Tharaka
*/
