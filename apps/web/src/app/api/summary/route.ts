import { getSession } from "@/features/auth";
import { getSummary } from "@reclara/db/queries/summary.query";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;

    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    console.log("Fetching summary for id:", id, "and userId:", user.id);

    const response = await getSummary({
      id: id,
      userId: user.id,
    });

    console.log("Fetched summary:", response);

    return NextResponse.json({ data: response }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
};
