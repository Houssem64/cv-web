import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;
    
    // Validate required fields
    if (!name || !email || !message) {    
      return new NextResponse(JSON.stringify({ error: 'Name, email and message are required' }), {
        status: 400,
        headers: headers,
      });
    }

    if (!emailRegex.test(email)) {
      return new NextResponse(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: headers,
      });
    }
    
    const recipientEmail = process.env.CONTACT_EMAIL || 'houssem.dev@outlook.com';
      
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: recipientEmail,
      replyTo: email,
      subject: subject || `New message from ${name}`,
      html: `
        <div>
          <h2>New message from your portfolio website</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });
    
    if (error) {
      console.error('Error sending email:', error);
      return new NextResponse(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: headers,
      }
      );
    }
    
    return new NextResponse(JSON.stringify({ success: true, message: 'Email sent successfully' }), {
      status: 200,
      headers: headers,
    }
    );
  } catch (error) {
    console.error('Error in send-email API:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to send email' }), { status: 500, headers: headers });
  }
} 