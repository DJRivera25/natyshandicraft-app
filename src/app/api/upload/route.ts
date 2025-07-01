import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Buffer } from 'buffer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

type CloudinaryUploadResult = {
  secure_url: string;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Invalid file input' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result: CloudinaryUploadResult = await new Promise(
      (resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (error || !result?.secure_url)
              return reject(error || new Error('Upload failed'));
            resolve({ secure_url: result.secure_url });
          }
        );
        upload.end(buffer);
      }
    );

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}
