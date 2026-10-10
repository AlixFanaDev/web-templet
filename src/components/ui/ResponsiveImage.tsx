import type { CSSProperties } from 'react';
import type { PhotoAsset } from '@/data/assets';

type Props = {
  photo: PhotoAsset;
  /** class for the <img> itself */
  className?: string;
  /** class for the <picture> wrapper */
  pictureClassName?: string;
  style?: CSSProperties;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  /** extra attributes forwarded to the <img> (data-*, fetchPriority, ref …) */
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement> & {
    [key: `data-${string}`]: string | undefined;
  };
};

const withExt = (src: string, ext: 'avif' | 'webp') => src.replace(/\.jpg$/, `.${ext}`);

/**
 * `<picture>` with AVIF → WebP → JPEG sources.
 *
 * Every image slot below the fold is `loading="lazy"` with explicit
 * `width`/`height` (zero CLS); the hero opts into `loading="eager"` +
 * `fetchPriority="high"` at its call site.
 *
 * NOTE: AVIF variants are produced by `scripts/build-responsive.py` (ffmpeg).
 * If a variant is missing the browser falls back to the next source type.
 */
export function ResponsiveImage({
  photo,
  className = '',
  pictureClassName = '',
  style,
  loading = 'lazy',
  sizes,
  imgProps,
}: Props) {
  return (
    <picture className={pictureClassName}>
      <source srcSet={withExt(photo.src, 'avif')} type="image/avif" sizes={sizes} />
      <source srcSet={withExt(photo.src, 'webp')} type="image/webp" sizes={sizes} />
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={loading}
        decoding="async"
        className={className}
        style={style}
        {...imgProps}
      />
    </picture>
  );
}
