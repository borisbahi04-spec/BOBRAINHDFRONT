import React from 'react';

interface StyleObject {
  color: string;
  sharpe: 'radiussquare' | 'square' | 'circle';
}

interface ImagePlaceholderProps {
  imageUrl: string | null;
  styleObject: StyleObject;
  width?: string | number;
  height?: string | number;
}

const ImagePlaceholder = ({
  imageUrl,
  styleObject,
  width = 100,
  height = 80,
}: ImagePlaceholderProps): React.ReactElement => {
  const getBorderRadius = (): string => {
    switch (styleObject?.sharpe) {
      case 'circle':
        return '50%';
      case 'radiussquare':
        return '12px';
      case 'square':
      default:
        return '0px';
    }
  };

  const placeholderStyle: React.CSSProperties = {
    width,
    height,
    backgroundColor: styleObject?.color || 'gray',
    borderRadius: getBorderRadius(),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    cursor: 'default',
  };

  return imageUrl
    ? React.createElement('img', {
        src: imageUrl,
        alt: 'Preview',
        style: {
          maxWidth: width,
          maxHeight: height,
          cursor: 'pointer',
        },
      })
    : React.createElement(
        'div',
        { style: placeholderStyle },
        ''
      );
};

export default ImagePlaceholder;
