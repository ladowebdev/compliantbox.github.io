// Follow this setup guide to integrate the Deno runtime successfully: https://deno.land/manual/getting_started/setup_your_environment
// Supabase Edge function for sending SMS notifications using MessageBird

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('MESSAGEBIRD_API_KEY');
    const originator = Deno.env.get('MESSAGEBIRD_ORIGINATOR');

    if (!apiKey || !originator) {
      throw new Error('Missing MessageBird credentials');
    }

    const { to, complaintId, status, message } = await req.json();

    // Validate input
    if (!to || !complaintId || !status) {
      throw new Error('Missing required parameters');
    }

    // Format the message
    const truncatedMessage = message ? 
      (message.length > 100 ? message.substring(0, 97) + '...' : message) : 
      '';
    
    const smsBody = `Complaint #${complaintId.substring(0, 8)} Status: ${status}${truncatedMessage ? '\n' + truncatedMessage : ''}\nContact: 1800-425-1456`;

    // Send the SMS using MessageBird API
    const response = await fetch('https://rest.messagebird.com/messages', {
      method: 'POST',
      headers: {
        'Authorization': `AccessKey ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipients: [to.startsWith('+') ? to : `+91${to}`],
        originator: originator,
        body: smsBody,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.description || 'Failed to send SMS');
    }

    const result = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        messageId: result.id,
        status: result.status,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error sending SMS:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to send SMS',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});