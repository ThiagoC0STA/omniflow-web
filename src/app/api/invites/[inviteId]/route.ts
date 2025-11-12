import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function assertAdmin(
  request: NextRequest
): Promise<{ errorResponse: NextResponse } | { userId: string }> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return {
      errorResponse: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      errorResponse: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  const { data: userData, error: userError } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userError || !userData || userData.role !== "admin") {
    return {
      errorResponse: NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      ),
    };
  }

  return { userId: user.id };
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { inviteId: string } }
) {
  try {
    const adminCheck = await assertAdmin(request);
    if ("errorResponse" in adminCheck) {
      return adminCheck.errorResponse;
    }

    const { inviteId } = params;

    const { data: invite, error: inviteError } = await supabaseAdmin
      .from("invites")
      .select("id, email, used")
      .eq("id", inviteId)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    const { error: deleteInviteError } = await supabaseAdmin
      .from("invites")
      .delete()
      .eq("id", inviteId);

    if (deleteInviteError) {
      throw deleteInviteError;
    }

    let removedUserId: string | null = null;
    let authUserDeleted = false;

    if (!invite.used) {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", invite.email)
        .single();

      if (!profileError && profile) {
        removedUserId = profile.id;

        const { error: deleteProfileError } = await supabaseAdmin
          .from("users")
          .delete()
          .eq("id", profile.id);

        if (deleteProfileError && deleteProfileError.code !== "PGRST116") {
          console.error(
            "Error deleting user profile for invite:",
            deleteProfileError
          );
        }

        const { error: deleteAuthError } =
          await supabaseAdmin.auth.admin.deleteUser(profile.id);
        if (deleteAuthError) {
          if (deleteAuthError.message !== "User not found") {
            console.error(
              "Error deleting auth user for invite:",
              deleteAuthError
            );
          }
        } else {
          authUserDeleted = true;
        }
      }
    }

    return NextResponse.json({
      success: true,
      removedUserId,
      authUserDeleted,
    });
  } catch (error: any) {
    console.error("Error canceling invite:", error);
    return NextResponse.json(
      {
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
