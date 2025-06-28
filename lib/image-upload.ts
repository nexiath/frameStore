'use client';

// Utility functions for image handling

export interface ImageUploadResult {
  url: string;
  file?: File;
  size: number;
  type: string;
  name: string;
}

/**
 * Convert file to base64 data URL
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please use JPG, PNG, GIF, or WebP.'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Please use images smaller than 10MB.'
    };
  }

  return { valid: true };
}

/**
 * Resize image to specific dimensions
 */
export function resizeImage(
  file: File, 
  maxWidth: number = 600, 
  maxHeight: number = 400,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          } else {
            reject(new Error('Failed to resize image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Upload image to a service (placeholder for real implementation)
 */
export async function uploadImageToService(file: File): Promise<string> {
  // In a real implementation, you would upload to:
  // - Supabase Storage
  // - Cloudinary
  // - AWS S3
  // - Vercel Blob
  // etc.

  // For now, we'll return a data URL
  return fileToDataURL(file);
}

/**
 * Generate AI image using various providers
 */
export async function generateAIImage(
  prompt: string,
  style?: string,
  provider: 'pollinations' | 'placeholder' = 'pollinations'
): Promise<string[]> {
  const fullPrompt = prompt + (style ? `, ${style}` : '');
  const encodedPrompt = encodeURIComponent(fullPrompt);

  switch (provider) {
    case 'pollinations':
      // Generate multiple variations with different seeds
      return Array.from({ length: 4 }, (_, index) => {
        const seed = Math.floor(Math.random() * 1000000);
        return `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=600&height=400&model=flux&enhance=true`;
      });

    case 'placeholder':
    default:
      // Fallback to placeholder images
      return Array.from({ length: 4 }, (_, index) => {
        const colors = ['8B5CF6', '06B6D4', 'F59E0B', 'EF4444'];
        const color = colors[index % colors.length];
        return `https://via.placeholder.com/600x400/${color}/FFFFFF?text=AI+Generated+${index + 1}`;
      });
  }
}

/**
 * Validate image URL
 */
export function validateImageURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    return validExtensions.some(ext => pathname.endsWith(ext)) ||
           url.includes('image') ||
           url.includes('photo') ||
           url.includes('pic');
  } catch {
    return false;
  }
}

/**
 * Get image metadata
 */
export function getImageMetadata(url: string): Promise<{
  width: number;
  height: number;
  aspectRatio: number;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight
      });
    };
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Compress image for better performance
 */
export function compressImage(file: File, quality: number = 0.7): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Compression failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}