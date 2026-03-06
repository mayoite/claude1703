/**
 * __mocks__/three.js
 * Minimal Three.js stub so Jest doesn't try to compile WebGL binaries.
 */
const THREE = {
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    domElement: { tagName: 'CANVAS' },
    dispose: jest.fn(),
  })),
  Scene: jest.fn().mockImplementation(() => ({ add: jest.fn() })),
  PerspectiveCamera: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
    lookAt: jest.fn(),
  })),
  Group: jest.fn().mockImplementation(() => ({ clone: jest.fn().mockReturnThis(), add: jest.fn() })),
  Mesh: jest.fn(),
  MeshStandardMaterial: jest.fn(),
  BoxGeometry: jest.fn(),
  SphereGeometry: jest.fn(),
  Vector3: jest.fn().mockImplementation(() => ({ set: jest.fn(), copy: jest.fn() })),
  Color: jest.fn(),
  AmbientLight: jest.fn(),
  SpotLight: jest.fn(),
  DirectionalLight: jest.fn(),
  Euler: jest.fn(),
  Quaternion: jest.fn(),
  Object3D: jest.fn().mockImplementation(() => ({ clone: jest.fn().mockReturnThis() })),
};

module.exports = THREE;
module.exports.default = THREE;
