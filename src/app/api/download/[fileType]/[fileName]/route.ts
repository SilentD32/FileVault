import { readFile } from 'fs/promises';
import { join } from 'path';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileType: string; fileName: string }> }
) {
  try {
    const { fileType, fileName } = await params;

    // Security: Only allow downloading .enc and .key.txt files
    if (fileType !== 'encrypted' && fileType !== 'key') {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Decode the fileName from URL
    const decodedFileName = decodeURIComponent(fileName);

    // Validate filename to prevent directory traversal
    if (decodedFileName.includes('..') || decodedFileName.includes('/')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, decodedFileName);

    // Read the file
    const fileBuffer = await readFile(filePath);

    if (fileType === 'key') {
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="${decodedFileName}"`,
        },
      });
    } else {
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${decodedFileName}"`,
        },
      });
    }
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'File not found or cannot be downloaded' },
      { status: 404 }
    );
  }
}
