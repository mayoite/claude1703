/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * __mocks__/r3f.js
 * Stub for @react-three/fiber in Jest (no WebGL renderer available).
 */
const React = require('react');

module.exports = {
  Canvas: ({ 'data-testid': testId }) =>
    React.createElement('div', { 'data-testid': testId ?? 'r3f-canvas' }),
  // ↑ Children deliberately omitted — Three.js intrinsic elements like
  //   <ambientLight>, <spotLight>, <primitive> are not valid HTML and produce
  //   React DOM warnings when children are forwarded in a jsdom test environment.
  useFrame: jest.fn(),
  useThree: jest.fn(() => ({
    camera: {},
    gl: {},
    scene: {},
    size: { width: 800, height: 600 },
  })),
  extend: jest.fn(),
  useLoader: jest.fn(() => ({ scene: { clone: jest.fn().mockReturnValue({}) } })),
};
