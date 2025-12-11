import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { randomBytes, createCipheriv } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate encryption key and IV
    const encryptionKey = randomBytes(32); // 256-bit key for AES-256
    const iv = randomBytes(16); // 128-bit IV

    // Encrypt the file
    const cipher = createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encryptedData = cipher.update(buffer);
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);

    // Combine IV and encrypted data
    const combinedData = Buffer.concat([iv, encryptedData]);

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Create a filename with timestamp to avoid conflicts
    const timestamp = Date.now();
    const encryptedFileName = `${timestamp}-${file.name}.enc`;
    const filePath = join(uploadDir, encryptedFileName);

    // Write encrypted file to disk
    await writeFile(filePath, combinedData);

    // Create the key file content
    const keyFileContent = `File Encryption Key
========================
Original Filename: ${file.name}
Encrypted Filename: ${encryptedFileName}
Encryption Method: AES-256-CBC
Key (Hex): ${encryptionKey.toString('hex')}
IV (Hex): ${iv.toString('hex')}

To decrypt this file:
1. Use a tool that supports AES-256-CBC decryption
2. Use the Key and IV values above
3. The encrypted file is stored without the IV in the filename - use the IV from this file

Keep this key file safe! Without it, the encrypted file cannot be decrypted.`;

    const keyFileName = `${timestamp}-${file.name}.key.txt`;
    const keyFilePath = join(uploadDir, keyFileName);

    // Write key file to disk
    await writeFile(keyFilePath, keyFileContent);

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'unknown',
      storedAs: encryptedFileName,
      keyFile: keyFileName,
      encryptionKey: encryptionKey.toString('hex'),
      iv: iv.toString('hex'),
      message: 'File uploaded and encrypted successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
