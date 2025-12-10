import { supabase } from "../configs/supabase";

export const uploadFiles = async (
  bucket: string,
  files: Express.Multer.File[],
  folder: string = "uploads"
): Promise<string[]> => {
  if (files.length === 0) return [];

  const uploadPromises = files.map(async (file) => {
    const fileName = `${folder}/${Date.now()}_${file.originalname.replace(
      /\s/g,
      "_"
    )}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  });

  return await Promise.all(uploadPromises);
};

export const uploadFile = async (
  bucket: string,
  file: Express.Multer.File,
  fullPath: string
): Promise<string> => {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(fullPath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(fullPath);
  return data.publicUrl;
};
