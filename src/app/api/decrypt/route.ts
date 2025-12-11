import { createDecipheriv } from 'crypto';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const encryptedFile = formData.get('encryptedFile') as File;
    const keyFile = formData.get('keyFile') as File;

    if (!encryptedFile || !keyFile) {
      return NextResponse.json(
        { error: 'Both encrypted file and key file are required' },
        { status: 400 }
      );
    }

    // Read the encrypted file
    const encryptedBuffer = Buffer.from(await encryptedFile.arrayBuffer());

    // Read and parse the key file
    const keyFileContent = await keyFile.text();
    
    // Extract key and IV from the key file
    const keyRe = /Key \(Hex\):\s*([a-f0-9]+)/i;
    const ivRe = /IV \(Hex\):\s*([a-f0-9]+)/i;
    const filenameRe = /Original Filename:\s*(.+)/i;
    const keyMatch = keyRe.exec(keyFileContent);
    const ivMatch = ivRe.exec(keyFileContent);
    const filenameMatch = filenameRe.exec(keyFileContent);

    if (!keyMatch || !ivMatch) {
      return NextResponse.json(
        { error: 'Invalid key file format. Could not extract encryption key or IV.' },
        { status: 400 }
      );
    }

    const keyHex = keyMatch[1] as string;
    const ivHex = ivMatch[1] as string;
    const encryptionKey = Buffer.from(keyHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const originalFilename = filenameMatch ? (filenameMatch[1] as string).trim() : 'decrypted-file';

    // The encrypted buffer contains IV + encrypted data
    // Extract the encrypted data (skip the IV that's prepended in storage)
    const encryptedData = encryptedBuffer;

    // Decrypt the file
    const decipher = createDecipheriv('aes-256-cbc', encryptionKey, iv);
    let decryptedData = decipher.update(encryptedData);
    decryptedData = Buffer.concat([decryptedData, decipher.final()]);

    // Return the decrypted file
    return new NextResponse(decryptedData, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${originalFilename}"`,
      },
    });
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to decrypt file' },
      { status: 500 }
    );
  }
}
