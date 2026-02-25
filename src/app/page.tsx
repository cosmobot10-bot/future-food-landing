"use client";

import { useEffect, useRef, useState } from "react";

const CONTINUE_CTA_DELAY_MS = 1000;
const CONTINUE_CTA_TEXT = "Less Jokes, More Free Food, click here to continue";
const CONTINUE_CTA_URL = "https://www.fidf.org/?form=FUNQMMJVHZD&utm_source=direct&utm_medium=button&utm_campaign=2026_fidfhq_evergreen_onetime&utm_content=homepage_donate_today_button&_gl=1*41ka8*_ga*NzQ5MTM3MjEuMTc3MjA2MjA1Ng..*_ga_1C9D2S1P8N*czE3NzIwNjIwNTUkbzEkZzAkdDE3NzIwNjIwNTUkajYwJGwwJGgw";

export default function Home() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [, setPlaybackMessage] = useState("");
  const [videoMissing, setVideoMissing] = useState(false);
  const [showContinueCta, setShowContinueCta] = useState(false);
  const ctaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const clearCtaTimer = () => {
    if (ctaTimerRef.current) {
      clearTimeout(ctaTimerRef.current);
      ctaTimerRef.current = null;
    }
  };

  const sendLaunchTelemetry = () => {
    if (typeof window === "undefined") return;

    const endpoint = "/api/telemetry/launch-mission";

    const payload = JSON.stringify({ event: "launch_mission" });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(endpoint, blob);
      return;
    }

    void fetch(endpoint, {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    });
  };

  const openVideo = () => {
    setPlaybackMessage("");
    setVideoMissing(false);
    setShowContinueCta(false);
    clearCtaTimer();
    setIsVideoOpen(true);

    sendLaunchTelemetry();
  };

  const closeVideo = () => {
    const video = videoRef.current;

    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    clearCtaTimer();
    setIsVideoOpen(false);
    setPlaybackMessage("");
    setVideoMissing(false);
    setShowContinueCta(false);
  };

  const handleVideoPlaying = () => {
    if (showContinueCta || ctaTimerRef.current) return;

    ctaTimerRef.current = setTimeout(() => {
      setShowContinueCta(true);
      ctaTimerRef.current = null;
    }, CONTINUE_CTA_DELAY_MS);
  };

  useEffect(() => {
    if (!isVideoOpen) return;

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeVideo();
      }
    };

    document.addEventListener("keydown", onEsc);

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
          setPlaybackMessage("");
        } catch {
          setPlaybackMessage("");
        }
      }
    };

    void tryAutoplay();
  }, [isVideoOpen]);

  useEffect(() => {
    return () => {
      clearCtaTimer();
    };
  }, []);

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
            <video
              ref={videoRef}
              autoPlay
              playsInline
              disablePictureInPicture
              controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
              className="pointer-events-none aspect-video w-full rounded-lg bg-black"
              preload="auto"
              onPlaying={handleVideoPlaying}
              onError={() => {
                setVideoMissing(true);
              }}
            >
              <source src="/video/rickroll.mp4" type="video/mp4" />
              Your browser does not support the HTML5 video tag.
            </video>

            {showContinueCta && (
              <div className="px-2 pb-2 pt-4">
                <a
                  href={CONTINUE_CTA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-md border border-cyan-200/70 bg-cyan-300 px-4 py-3 text-center text-sm font-semibold text-slate-900 shadow-[0_12px_28px_rgba(34,211,238,0.35)] transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060814] sm:text-base"
                >
                  {CONTINUE_CTA_TEXT}
                </a>
              </div>
            )}

            {videoMissing && (
              <p className="px-2 pb-2 pt-3 text-center text-sm text-cyan-100/90" aria-live="polite">
                Video file not found: expected at /public/video/rickroll.mp4.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
