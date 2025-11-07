import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { resizeImage } from "@/lib/imageResize";

export function useImageUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      console.log('Starting image upload...', { fileName: file.name, fileSize: file.size, fileType: file.type });
      
      // 1. Resize image for web optimization
      const resizedBlob = await resizeImage(file);
      console.log('Image resized successfully', { size: resizedBlob.size });
      
      // 2. Generate unique filename with timestamp and random string
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      console.log('Uploading to storage...', { fileName, bucket: 'images' });
      
      // 3. Upload to Supabase Storage "images" bucket
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, resizedBlob, {
          contentType: file.type,
          upsert: false
        });
      
      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }
      
      console.log('Upload successful:', data);
      
      // 4. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(data.path);
      
      return publicUrl;
    }
  });
}
