// FileUploader.tsx
'use client';
import { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';

interface FileUploaderProps {
  onUpload?: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onUpload, 
  multiple = false, 
  maxFiles = 5, 
  maxSizeMB = 5 
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Only image files are allowed';
    }
    
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeMB}MB`;
    }
    
    return null;
  };

  const handleFiles = useCallback((newFiles: File[]) => {
    setError('');
    
    // If not multiple, replace existing files
    if (!multiple) {
      const validationError = validateFile(newFiles[0]);
      if (validationError) {
        setError(validationError);
        return;
      }
      setFiles([newFiles[0]]);
      return;
    }
    
    // For multiple files, check limits
    if (files.length + newFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files`);
      return;
    }
    
    // Validate each file
    const validFiles: File[] = [];
    for (const file of newFiles) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }
      validFiles.push(file);
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  }, [files, maxFiles, maxSizeMB, multiple]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    handleFiles(selectedFiles);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      setError('Please select at least one file to upload');
      return;
    }
    
    setUploadStatus('uploading');
    setError('');
    
    try {
      // In a real application, you would upload to your server here
      // This is a mock upload simulation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate random success/failure for demo purposes
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        setUploadStatus('success');
        if (onUpload) {
          onUpload(files);
        }
        // Clear files after successful upload
        setTimeout(() => {
          setFiles([]);
          setUploadStatus('idle');
        }, 2000);
      } else {
        throw new Error('Upload failed. Please try again.');
      }
    } catch (err: any) {
      setUploadStatus('error');
      setError(err.message);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-uploader">
      <div 
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${uploadStatus === 'uploading' ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploadStatus === 'uploading' ? (
          <div className="uploading-state">
            <div className="spinner"></div>
            <p>Uploading your files...</p>
          </div>
        ) : uploadStatus === 'success' ? (
          <div className="success-state">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
            <p>Upload successful!</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5z" clipRule="evenodd" />
                <path d="M5.25 9a.75.75 0 01.75.75v6.75h10.5V9.75a.75.75 0 011.5 0v6.75a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5V9.75A.75.75 0 015.25 9z" />
              </svg>
            </div>
            <p className="instruction">
              Drag & drop your {multiple ? 'images' : 'image'} here or{" "}
              <label htmlFor="file-input" className="browse-link">
                browse files
              </label>
            </p>
            <p className="requirements">
              Maximum file size: {maxSizeMB}MB. Supported formats: JPEG, PNG, WebP
            </p>
            <input
              id="file-input"
              type="file"
              multiple={multiple}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInput}
              className="file-input"
            />
          </>
        )}
      </div>

      {error && (
        <div className="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {files.length > 0 && uploadStatus !== 'uploading' && uploadStatus !== 'success' && (
        <div className="file-previews">
          <h3>Selected Files ({files.length}{multiple ? `/${maxFiles}` : ''})</h3>
          <div className="preview-container">
            {files.map((file, index) => (
              <div key={index} className="file-preview">
                <div className="image-container">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    fill
                    className="preview-image"
                  />
                  <button 
                    type="button" 
                    className="remove-button"
                    onClick={() => removeFile(index)}
                    aria-label="Remove file"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="file-info">
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{formatFileSize(file.size)}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            type="button" 
            className="upload-button"
            onClick={uploadFiles}
          >
            Upload Files
          </button>
        </div>
      )}

      <style jsx>{`
        .file-uploader {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .drop-zone {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          padding: 2.5rem;
          text-align: center;
          transition: all 0.3s ease;
          background-color: #f9fafb;
          position: relative;
        }
        
        .drop-zone.dragging {
          border-color: #3b82f6;
          background-color: #eff6ff;
        }
        
        .drop-zone.uploading {
          border-color: #10b981;
          background-color: #ecfdf5;
        }
        
        .upload-icon {
          width: 48px;
          height: 48px;
          color: #9ca3af;
          margin: 0 auto 1rem;
        }
        
        .drop-zone.dragging .upload-icon {
          color: #3b82f6;
        }
        
        .instruction {
          font-size: 1.125rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        
        .browse-link {
          color: #3b82f6;
          cursor: pointer;
          font-weight: 600;
        }
        
        .browse-link:hover {
          text-decoration: underline;
        }
        
        .requirements {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }
        
        .file-input {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        .uploading-state, .success-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        
        .spinner {
          width: 48px;
          height: 48px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .success-state svg {
          width: 48px;
          height: 48px;
          color: #10b981;
        }
        
        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.75rem;
          background-color: #fef2f2;
          color: #b91c1c;
          border-radius: 8px;
          font-size: 0.875rem;
        }
        
        .error-message svg {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
        
        .file-previews {
          margin-top: 1.5rem;
        }
        
        .file-previews h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }
        
        .preview-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .file-preview {
          position: relative;
        }
        
        .image-container {
          position: relative;
          width: 100%;
          height: 120px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .preview-image {
          object-fit: cover;
        }
        
        .remove-button {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.9);
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .remove-button:hover {
          background-color: rgba(255, 255, 255, 1);
          color: #ef4444;
        }
        
        .remove-button svg {
          width: 16px;
          height: 16px;
        }
        
        .file-info {
          margin-top: 0.5rem;
        }
        
        .file-name {
          font-size: 0.75rem;
          font-weight: 500;
          color: #374151;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
        }
        
        .file-size {
          font-size: 0.7rem;
          color: #6b7280;
          margin: 0;
        }
        
        .upload-button {
          width: 100%;
          padding: 0.75rem 1.5rem;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .upload-button:hover {
          background-color: #2563eb;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FileUploader;