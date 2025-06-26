import { HeroVideoDialog } from "../Helper/VideoHero";
import YoutubeVideoThumbnail from "../../assets/thumbnails/heimdall-thumbnail.jpg";
export function VideoHero() {
  return (
    <div className="relative max-w-7xl mx-auto mt-20 px-4" id="demo-video">
      <HeroVideoDialog
        className="block dark:hidden"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/-B-Hw2NKQGc"
        thumbnailSrc={YoutubeVideoThumbnail}
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/-B-Hw2NKQGc"
        thumbnailSrc={YoutubeVideoThumbnail}
        thumbnailAlt="Hero Video"
      />
    </div>
  );
}
