import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { command } = await req.json(); // Command from the client

    // Execute the command in the Docker container
    const { stdout, stderr } = await execAsync(
      `docker exec student_info_management_container ${command}`
    );

    if (stderr) {
      return NextResponse.json({ error: stderr }, { status: 500 });
    }

    return NextResponse.json({ output: stdout });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
