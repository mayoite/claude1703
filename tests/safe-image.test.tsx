/**
 * tests/safe-image.test.tsx
 * Unit tests for the SafeImage component.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SafeImage } from "../components/SafeImage";

const DEFAULT_FALLBACK = "/images/products/60x30-workstation-1.webp";

describe("SafeImage – Unit Tests", () => {
  test("renders with provided src and alt", () => {
    render(
      <SafeImage
        src="/images/chair.webp"
        alt="Office Chair"
        width={400}
        height={300}
      />,
    );
    const img = screen.getByAltText("Office Chair");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/images/chair.webp");
  });

  test("uses default fallback when src is null", () => {
    render(
      <SafeImage src={null} alt="Missing Product" width={400} height={300} />,
    );
    const img = screen.getByAltText("Missing Product");
    expect(img).toHaveAttribute("src", DEFAULT_FALLBACK);
  });

  test("uses default fallback when src is undefined", () => {
    render(<SafeImage alt="No Source" width={400} height={300} />);
    const img = screen.getByAltText("No Source");
    expect(img).toHaveAttribute("src", DEFAULT_FALLBACK);
  });

  test("falls back to fallbackSrc on image load error", () => {
    render(
      <SafeImage
        src="/images/broken-link.webp"
        alt="Broken Image"
        fallbackSrc="/images/fallback.webp"
        width={400}
        height={300}
      />,
    );
    const img = screen.getByAltText("Broken Image");
    // Simulate a load error
    fireEvent.error(img);
    expect(img).toHaveAttribute("src", "/images/fallback.webp");
  });

  test("uses custom fallbackSrc over the default when provided", () => {
    render(
      <SafeImage
        src={null}
        alt="Custom Fallback"
        fallbackSrc="/images/custom-fallback.webp"
        width={400}
        height={300}
      />,
    );
    const img = screen.getByAltText("Custom Fallback");
    expect(img).toHaveAttribute("src", "/images/custom-fallback.webp");
  });

  test("does not switch to fallback if src is valid (no error fired)", () => {
    render(
      <SafeImage
        src="/images/valid.webp"
        alt="Valid Image"
        width={400}
        height={300}
      />,
    );
    const img = screen.getByAltText("Valid Image");
    // No error fired → still showing original src
    expect(img).toHaveAttribute("src", "/images/valid.webp");
  });

  test("only falls back once on repeated error events", () => {
    render(
      <SafeImage
        src="/images/broken.webp"
        alt="Multiple Errors"
        fallbackSrc="/images/fallback.webp"
        width={400}
        height={300}
      />,
    );
    const img = screen.getByAltText("Multiple Errors");
    fireEvent.error(img);
    fireEvent.error(img); // second error should not cause another change
    expect(img).toHaveAttribute("src", "/images/fallback.webp");
  });
});
