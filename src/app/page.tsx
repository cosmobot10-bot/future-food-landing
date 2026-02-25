"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [playbackMessage, setPlaybackMessage] = useState("");
  const [videoMissing, setVideoMissing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openVideo = () => {
    setPlaybackMessage("");
    setVideoMissing(false);
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    const video = videoRef.current;

    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    setIsVideoOpen(false);
    setPlaybackMessage("");
    setVideoMissing(false);
  };

  useEffect(() => {
    if (!isVideoOpen) return;

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeVideo();
      }
    };

    document.addEventListener("keydown", onEsc);
    closeButtonRef.current?.focus();

    return () => document.removeEventListener("keydown", onEsc);
  }, [isVideoOpen]);

  useEffect(() => {
    if (!isVideoOpen) return;

    const tryAutoplay = async () => {
      const video = videoRef.current;
      if (!video) return;

      video.currentTime = 0;
      video.muted = false;

      try {
        await video.play();
        setPlaybackMessage("");
      } catch {
        video.muted = true;

        try {
          await video.play();
          setPlaybackMessage(
            "Your browser blocked autoplay with sound. Tap the video or unmute in controls to hear audio.",
          );
        } catch {
          setPlaybackMessage(
            "Playback is blocked right now. Tap the play button in the video controls to start.",
          );
        }
      }
    };

    void tryAutoplay();
  }, [isVideoOpen]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#04030a] text-white">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="cosmos-bg" aria-hidden />
      <div className="cosmos-stars" aria-hidden />
      <div className="cosmos-grid" aria-hidden />

      <main
        id="main-content"
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16 md:px-10"
      >
        <section className="w-full text-center">
          <p className="mx-auto mb-6 inline-flex rounded-full border border-violet-300/35 bg-violet-300/12 px-4 py-1 text-xs uppercase tracking-[0.22em] text-violet-100/90">
            Future Food Club • Private Beta
          </p>

          <h1 className="mx-auto max-w-4xl text-balance text-5xl font-semibold leading-[0.97] tracking-tight sm:text-6xl lg:text-7xl">
            The future of not paying for food is here
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-blue-100/90 sm:text-lg">
            Join to learn more about the future of eating for less.
          </p>

          <div className="mt-10">
            <button
              type="button"
              className="cta-primary"
              onClick={openVideo}
              aria-haspopup="dialog"
              aria-expanded={isVideoOpen}
              aria-controls="launch-mission-video-modal"
            >
              Launch Mission
            </button>
          </div>
        </section>
      </main>

      {isVideoOpen && (
        <div
          id="launch-mission-video-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Launch Mission video player"
        >
          <div className="relative w-full max-w-5xl rounded-xl border border-cyan-200/30 bg-[#060814] p-2 shadow-[0_0_45px_rgba(14,199,255,0.28)]">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeVideo}
              className="absolute right-3 top-3 z-10 rounded-full border border-cyan-100/35 bg-black/65 px-3 py-1 text-sm font-medium text-cyan-100 hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              aria-label="Close video player"
            >
              Close ✕
            </button>

            <video
              ref={videoRef}
              className="aspect-video w-full rounded-lg bg-black"
              controls
              playsInline
              preload="auto"
              onError={() => {
                setVideoMissing(true);
                setPlaybackMessage(
                  "Video source missing. Add /public/video/rickroll.mp4 to enable playback.",
                );
              }}
            >
              <source src="/video/rickroll.mp4" type="video/mp4" />
              Your browser does not support the HTML5 video tag.
            </video>

            <p className="px-2 pb-2 pt-3 text-center text-sm text-cyan-100/90" aria-live="polite">
              {videoMissing
                ? "Video file not found: expected at /public/video/rickroll.mp4."
                : playbackMessage || "Tip: if audio is muted by your browser, use the unmute control in the player."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
