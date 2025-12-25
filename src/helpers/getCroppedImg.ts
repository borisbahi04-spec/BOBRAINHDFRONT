import { createCanvas, loadImage } from 'canvas';

// Utility function to get cropped image data as Base64 data URL
const getCroppedImg = async (imageSrc, crop) => {
  const canvas = createCanvas(crop.width, crop.height);
  const ctx = canvas.getContext('2d');

  const image = await loadImage(imageSrc);
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  // Convert the canvas content to a Base64 data URL
  const base64Image = canvas.toDataURL('image/jpeg'); // Adjust format if needed ('image/png', 'image/jpeg', etc.)

  return base64Image;
};

module.exports = getCroppedImg;
