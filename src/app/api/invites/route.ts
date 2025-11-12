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

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

    let createdUserId: string | undefined;

    let isExistingUser = false;

    if (existing) {
      isExistingUser = true;

      // User exists: send password reset email instead
      createdUserId = existing.id;

      // Check if user profile exists in users table
      const { data: existingProfile } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("id", existing.id)
        .single();

      if (existingProfile) {
        // Profile exists, just update role
        const { error: roleError } = await supabaseAdmin
          .from("users")
          .update({ role: role as "admin" | "client" })
          .eq("id", existing.id);
        if (roleError) console.error("Error updating role:", roleError);
      } else {
        // Profile doesn't exist, create it
        const { error: profileError } = await supabaseAdmin
          .from("users")
          .insert({
            id: existing.id,
            email: normalizedEmail,
            role: role as "admin" | "client",
          });
        if (profileError) {
          console.error("Error creating profile:", profileError);
          // If insert fails due to duplicate, try update instead
          if (profileError.code === "23505") {
            const { error: roleError } = await supabaseAdmin
              .from("users")
              .update({ role: role as "admin" | "client" })
              .eq("id", existing.id);
            if (roleError) console.error("Error updating role:", roleError);
          }
        }
      }

      // Send password reset email using Supabase's native system
      const redirectUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
        : `${req.nextUrl.origin}/auth/reset-password`;

      const { error: resetError } = await supabaseAdmin.auth.admin.generateLink(
        {
          type: "recovery",
          email: normalizedEmail,
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
        await supabaseAdmin.auth.admin.inviteUserByEmail(normalizedEmail, {
          redirectTo: redirectUrl,
        });

      if (inviteError) throw inviteError;
      createdUserId = inviteData?.user?.id;

      // The trigger should create the profile automatically, but we need to update the role
      // Try to update first (if trigger created it), if not exists, then insert
      if (createdUserId) {
        // First, try to update (in case trigger already created it)
        const { error: updateError } = await supabaseAdmin
          .from("users")
          .update({ role: role as "admin" | "client", email: normalizedEmail })
          .eq("id", createdUserId)
          .select()
          .single();

        // If update didn't find a row, try to insert
        if (updateError && updateError.code === "PGRST116") {
          // Row doesn't exist, try to insert
          const { error: insertError } = await supabaseAdmin
            .from("users")
            .insert({
              id: createdUserId,
              email: normalizedEmail,
              role: role as "admin" | "client",
            });

          // If insert fails due to duplicate (race condition with trigger), try update again
          if (insertError && insertError.code === "23505") {
            const { error: retryUpdateError } = await supabaseAdmin
              .from("users")
              .update({
                role: role as "admin" | "client",
                email: normalizedEmail,
              })
              .eq("id", createdUserId);
            if (retryUpdateError) {
              console.error(
                "Error updating role after retry:",
                retryUpdateError
              );
            }
          } else if (insertError) {
            console.error("Error creating profile:", insertError);
          }
        } else if (updateError) {
          console.error("Error updating role:", updateError);
        }
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
        email: normalizedEmail,
        used: isExistingUser,
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

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const includeUsed = req.nextUrl.searchParams.get("includeUsed") === "true";

    let query = supabaseAdmin
      .from("invites")
      .select("*")
      .order("created_at", { ascending: false });

    if (!includeUsed) {
      query = query.eq("used", false);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      invites: (data || []).map((invite) => ({
        ...invite,
        email: invite.email?.toLowerCase() ?? invite.email,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching invites:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
