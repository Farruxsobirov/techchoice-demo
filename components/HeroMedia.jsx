import { rimg } from '../lib/img';
import { SoundButton } from './Icons';

/**
 * Picture or mp4 video (uploaded in WordPress) inside the same frame.
 * Video: starts muted (browsers only allow silent autoplay), loops, plays only while on screen,
 * has a Sound button, and the frame takes the video's own shape (16:9 until the video says otherwise).
 * The picture is its poster. Only the video's header is fetched up front; the rest streams as it plays.
 */
export default function HeroMedia({ className, image, video, sizes, parallax, priority = false }) {
  if (video) {
    return (
      <figure className={`${className || ''} is-video`.trim()}>
        <video
          src={video}
          poster={image ? image.url : undefined}
          muted
          loop
          playsInline
          preload={priority ? 'metadata' : 'none'}
          data-autoplay=""
        />
        <SoundButton />
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
