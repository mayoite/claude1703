/**
 * __mocks__/modelViewer.js
 * Stub for @google/model-viewer (custom element not available in jsdom).
 */
// Registers a no-op <model-viewer> custom element if it hasn't been defined yet.
if (typeof customElements !== 'undefined' && !customElements.get('model-viewer')) {
  class ModelViewerElement extends HTMLElement {}
  customElements.define('model-viewer', ModelViewerElement);
}

module.exports = {};
