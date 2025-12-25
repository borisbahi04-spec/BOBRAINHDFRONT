

export const openBlobInNewTab = (data: BlobPart, contentType: string) => {
  const blob = new Blob([data], { type: contentType });
  const url = URL.createObjectURL(blob);
  window.open(url);
};
