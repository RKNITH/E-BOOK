export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// create separate file for aws helpers

export const generateS3ClientPublicUrl = (
  bucketName: string,
  fileName: string
) => {
  return `https://${bucketName}.s3.amazonaws.com/${fileName}`;
};
