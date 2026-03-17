/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * __mocks__/drei.js
 * Stub for @react-three/drei helpers used in ThreeViewer.tsx.
 */
const React = require('react');

const OrbitControls = () => null;
const useGLTF = jest.fn(() => ({
  scene: { clone: jest.fn().mockReturnValue({ type: 'Group' }) },
  nodes: {},
  materials: {},
}));
useGLTF.preload = jest.fn();

const Environment = () => null;
const ContactShadows = () => null;

module.exports = {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
  Html: ({ children }) => React.createElement('div', null, children),
  Center: ({ children }) => React.createElement('div', null, children),
};
