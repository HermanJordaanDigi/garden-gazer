import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { resizeImage } from "@/lib/imageResize";

export function useImageUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      // 1. Resize image for web optimization
      const resizedBlob = await resizeImage(file);
      
      // 2. Generate unique filename with timestamp and random string
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      // 3. Upload to Supabase Storage "images" bucket
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, resizedBlob, {
          contentType: file.type,
          upsert: false
        });
      
      if (error) throw error;
      
      // 4. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(data.path);
      
      return publicUrl;
    }
  });
}
