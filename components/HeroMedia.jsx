import { rimg } from '../lib/img';

/**
 * Picture or mp4 video (uploaded in WordPress) inside the same frame.
 * Video: muted, looped, inline; it only loads/plays while on screen (public/site.js), the picture is its poster.
 */
export default function HeroMedia({ className, image, video, sizes, parallax, priority = false }) {
  if (video) {
    return (
      <figure className={className}>
        <video
          src={video}
          poster={image ? image.url : undefined}
          muted
          loop
          playsInline
          preload={priority ? 'auto' : 'none'}
          data-autoplay=""
          data-parallax={parallax}
          aria-hidden="true"
        />
      </figure>
    );
  }
  if (!image) return null;
  return (
    <figure className={className}>
      <img
        {...rimg(image.url, { widths: [640, 1080, 1920], sizes })}
        alt={image.alt || ''}
        data-parallax={parallax}
        {...(priority ? { fetchPriority: 'high' } : { loading: 'lazy' })}
        decoding="async"
      />
    </figure>
  );
}
