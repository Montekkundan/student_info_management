import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Command to get the file structure of the Docker container
    const { stdout, stderr } = await execAsync(
      "docker exec student_info_management_container ls -R /app"
    );

    if (stderr) {
      return NextResponse.json({ error: stderr }, { status: 500 });
    }

    const fileStructure = stdout.split("\n").filter(Boolean); // Parse file structure
    return NextResponse.json({ files: fileStructure });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
