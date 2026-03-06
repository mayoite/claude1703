/**
 * __mocks__/next-image.tsx
 * Renders a plain <img> so tests can query by alt text, src, etc.
 * Must be .tsx because it contains JSX.
 */
import React from "react";
import type { ImageProps } from "next/image";

type MockImageProps = Omit<ImageProps, "src"> & { src?: string | null };

const MockImage = ({
  src,
  alt,
  fill: _fill,
  priority: _priority,
  ...rest
}: MockImageProps) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src ?? undefined} alt={alt} {...rest} />
);

MockImage.displayName = "NextImageMock";

export default MockImage;
