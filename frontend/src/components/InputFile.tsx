import { Image } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  alt: string;
  value?: string;
  onChange?: (file: File | null) => void;
}

export const InputFile = ({ alt, value, onChange }: ImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    onChange?.(file);
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    if (fileRef.current) {
      fileRef.current.value = '';
    }
    onChange?.(null);
  };

  useEffect(() => {
    if (value) {
      setImagePreview(value);
    }
  }, [value]);

  return (
    <>
      <label className="block text-[#43474F] font-semibold mb-2 text-sm">
        Imagen
      </label>
      <div
        onClick={() => fileRef.current?.click()}
        className="w-full h-28 border-3 border-[#C3C6D0] border-dashed flex items-center justify-center cursor-pointer"
      >
        {imagePreview ? (
          <img src={imagePreview} alt={alt} className="object-cover h-full" />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Image size={44} className="text-[#6B7280]" />
            <span className="text-[#6B7280] text-xs text-center mt-1">
              .png, .jpg o .jpeg
            </span>
          </div>
        )}
      </div>
      {imagePreview && (
        <Button
          type="button"
          variant="outline"
          onClick={handleRemoveImage}
          className="cursor-pointer rounded-sm text-[#151C23] mt-1 w-full"
        >
          Remover imagen
        </Button>
      )}
      <input
        type="file"
        ref={fileRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};
