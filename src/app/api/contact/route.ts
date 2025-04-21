import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import { Resend } from 'resend';

// Initialize the Resend SDK with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// GET /api/contact - Get contact information
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Try to find existing contact information
    let contactData = await Contact.findOne();
    
    // If no data exists, create a default one
    if (!contactData) {
      contactData = await Contact.create({});
    }
    
    return NextResponse.json(contactData, { status: 200 });
  } catch (error) {
    console.error('Error fetching contact information:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact information' },
      { status: 500 }
    );
  }
}

// PUT /api/contact - Update contact information (protected, admin only)
export async function PUT(req: NextRequest) {
  try {
    // Check for authentication
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const body = await req.json();
    
    // Ensure email is provided
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }
    
    // Try to find existing contact information
    let contactData = await Contact.findOne();
    
    // If no data exists, create a new one
    if (!contactData) {
      contactData = await Contact.create(body);
    } else {
      // Update existing data
      contactData = await Contact.findByIdAndUpdate(
        contactData._id,
        body,
        { new: true, runValidators: true }
      );
    }
    
    return NextResponse.json(contactData, { status: 200 });
  } catch (error) {
    console.error('Error updating contact information:', error);
    return NextResponse.json(
      { error: 'Failed to update contact information' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { firstName, lastName, email, subject, message } = await request.json();
    
    // Validate the required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Update with your verified domain
      to: process.env.CONTACT_EMAIL || 'delivered@resend.dev', // Recipient email for testing
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: `
Name: ${firstName} ${lastName}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
      // You can also use HTML for more styled emails
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${firstName} ${lastName}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Subject:</strong> ${subject}</p>
<h3>Message:</h3>
<p>${message}</p>
      `,
    });
    
    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Email sent successfully', id: data?.id },
      { status: 200 }
    );
    
  } catch (error: unknown) {
    console.error('Error in contact API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 