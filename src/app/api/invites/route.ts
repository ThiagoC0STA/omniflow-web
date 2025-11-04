import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side Supabase client with service role key for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

interface Payload {
  email: string;
  role?: string;
}

export async function POST(req: NextRequest) {
  try {
    // Verify the user is authenticated and admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create a client to verify the user session
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin in database
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError || !userData || userData.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const body: Payload = await req.json();
    const { email, role = "client" } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email === email);

    let createdUserId: string | undefined;

    if (existing) {
      // User exists: send password reset email instead
      createdUserId = existing.id;

      // Update role if needed
      const { error: roleError } = await supabaseAdmin
        .from("users")
        .update({ role: role as "admin" | "client" })
        .eq("id", existing.id);
      if (roleError) console.error("Error updating role:", roleError);

      // Send password reset email using Supabase's native system
      const redirectUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
        : `${req.nextUrl.origin}/auth/reset-password`;

      const { error: resetError } = await supabaseAdmin.auth.admin.generateLink(
        {
          type: "recovery",
          email: email,
          options: {
            redirectTo: redirectUrl,
          },
        }
      );

      if (resetError) {
        console.error("Error generating reset link:", resetError);
      }
    } else {
      // Create new user using inviteUserByEmail - this creates user AND sends email automatically
      const redirectUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
        : `${req.nextUrl.origin}/auth/reset-password`;

      const { data: inviteData, error: inviteError } =
        await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
          redirectTo: redirectUrl,
        });

      if (inviteError) throw inviteError;
      createdUserId = inviteData?.user?.id;

      // Create profile row
      if (createdUserId) {
        const { error: profileError } = await supabaseAdmin
          .from("users")
          .insert({
            id: createdUserId,
            email,
            role: role as "admin" | "client",
          });
        if (profileError) throw profileError;
      }
    }

    // Generate invite token (for tracking purposes)
    const inviteToken = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    // Create invite record
    const { data: inviteData, error: inviteError } = await supabaseAdmin
      .from("invites")
      .insert({
        email: email.trim(),
        used: false,
        created_by: user.id,
        token: inviteToken,
        expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      })
      .select()
      .single();

    if (inviteError) {
      console.error("Error creating invite:", inviteError);
      // Don't fail if invite creation fails, user is already created
    }

    return NextResponse.json({
      success: true,
      userId: createdUserId,
      inviteId: inviteData?.id,
      message: "User created and email sent successfully",
    });
  } catch (error: any) {
    console.error("Error in invite API:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
