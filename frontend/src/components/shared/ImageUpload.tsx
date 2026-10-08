'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadProfileImage, uploadCoverImage } from '@/services/api';
import { getErrorMessage } from '@/utils/errorHandler';

interface ImageUploadProps {
  type: 'profile' | 'cover';
  currentImage?: string;
  onUploadSuccess: (url: string) => void;
}

const ImageUpload = ({
  type,
  currentImage,
  onUploadSuccess,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string>(currentImage || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    // Upload to Cloudinary via backend
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response =
        type === 'profile'
          ? await uploadProfileImage(formData)
          : await uploadCoverImage(formData);

      onUploadSuccess(response.data.url);
      toast.success(
        `${type === 'profile' ? 'Profile' : 'Cover'} image uploaded`
      );
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Image upload failed'));
      setPreview(currentImage || '');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onUploadSuccess('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (type === 'cover') {
    return (
      <div className="relative">
        <div
          className={`w-full h-40 rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center cursor-pointer transition-colors ${
            preview
              ? 'border-transparent'
              : 'border-gray-300 hover:border-blue-400 bg-gray-50'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <Image src={preview} alt="Cover" fill className="object-cover" />
          ) : (
            <div className="text-center">
              <Upload size={24} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Click to upload cover photo
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Recommended: 1200×400px
              </p>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 size={24} className="text-white animate-spin" />
            </div>
          )}
        </div>
        {preview && !uploading && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove cover image"
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={14} />
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          aria-label="Upload cover image"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-5">
      <div
        className={`relative w-20 h-20 rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
          preview
            ? 'border-transparent'
            : 'border-gray-300 hover:border-blue-400 bg-gray-50'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <Image src={preview} alt="Profile" fill className="object-cover" />
        ) : (
          <Upload size={20} className="text-gray-400" />
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 size={16} className="text-white animate-spin" />
          </div>
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-sm font-medium text-blue-600 hover:underline disabled:opacity-60"
        >
          {preview ? 'Change photo' : 'Upload photo'}
        </button>
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="block text-xs text-red-500 hover:underline mt-1"
          >
            Remove
          </button>
        )}
        <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        aria-label="Upload profile image"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;