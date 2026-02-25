/* @vitest-environment jsdom */

import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Home from "./page";

describe("Home video CTA", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    Object.defineProperty(navigator, "sendBeacon", {
      value: vi.fn(() => true),
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("shows continue CTA one second after video actually starts playing", async () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: "Launch Mission" }));

    expect(screen.queryByRole("link", { name: "Less Jokes, More Free Food, click here to continue" })).toBeNull();

    const video = document.querySelector("video");
    expect(video).not.toBeNull();

    fireEvent.playing(video as HTMLVideoElement);

    await act(async () => {
      vi.advanceTimersByTime(999);
    });
    expect(screen.queryByRole("link", { name: "Less Jokes, More Free Food, click here to continue" })).toBeNull();

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    const continueLink = screen.getByRole("link", {
      name: "Less Jokes, More Free Food, click here to continue",
    });

    expect(continueLink.getAttribute("href")).toBe("https://www.fidf.org/?form=FUNQMMJVHZD&utm_source=direct&utm_medium=button&utm_campaign=2026_fidfhq_evergreen_onetime&utm_content=homepage_donate_today_button&_gl=1*41ka8*_ga*NzQ5MTM3MjEuMTc3MjA2MjA1Ng..*_ga_1C9D2S1P8N*czE3NzIwNjIwNTUkbzEkZzAkdDE3NzIwNjIwNTUkajYwJGwwJGgw");
  });
});
