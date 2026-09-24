import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json();

    if (!identifier || typeof identifier !== 'string') {
      return NextResponse.json(
        { error: 'Please enter your registered email address or username.' },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const secretKey = process.env.CLERK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: 'Server authentication configuration is missing.' },
        { status: 500 }
      );
    }

    // 1. Search for user by email address
    let user = null;
    const emailRes = await fetch(
      `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(cleanIdentifier)}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    if (emailRes.ok) {
      const emailUsers = await emailRes.json();
      if (Array.isArray(emailUsers) && emailUsers.length > 0) {
        user = emailUsers[0];
      }
    }

    // 2. If not found by email, search by username
    if (!user) {
      const userRes = await fetch(
        `https://api.clerk.com/v1/users?username=${encodeURIComponent(cleanIdentifier)}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );

      if (userRes.ok) {
        const usernameUsers = await userRes.json();
        if (Array.isArray(usernameUsers) && usernameUsers.length > 0) {
          user = usernameUsers[0];
        }
      }
    }

    // 3. Fallback query search
    if (!user) {
      const queryRes = await fetch(
        `https://api.clerk.com/v1/users?query=${encodeURIComponent(cleanIdentifier)}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );

      if (queryRes.ok) {
        const queryUsers = await queryRes.json();
        if (Array.isArray(queryUsers) && queryUsers.length > 0) {
          user = queryUsers[0];
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        {
          error: `No existing account found for "${identifier}". Please verify your email or click "Join Club (New)" to create your card.`,
        },
        { status: 404 }
      );
    }

    // 4. Create a single-use direct Sign-In Token (Ticket)
    // This allows immediate authentication without any email verification links!
    const tokenRes = await fetch('https://api.clerk.com/v1/sign_in_tokens', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id,
        expires_in_seconds: 3600,
      }),
    });

    if (!tokenRes.ok) {
      const errData = await tokenRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.errors?.[0]?.message || 'Failed to create direct login session.' },
        { status: 500 }
      );
    }

    const tokenData = await tokenRes.json();

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.first_name || user.username || 'Valued Member',
        email: user.email_addresses?.[0]?.email_address,
      },
      token: tokenData.token,
      url: tokenData.url,
    });
  } catch (err: any) {
    console.error('Direct login error:', err);
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred during direct login.' },
      { status: 500 }
    );
  }
}
