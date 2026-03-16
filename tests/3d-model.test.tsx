import React from "react";
import { render, screen } from "@testing-library/react";
import ThreeViewer from "../components/ThreeViewer";

describe("ThreeViewer", () => {
  test("renders fallback when no model URL is provided", () => {
    render(
      <ThreeViewer
        modelUrl=""
        fallback={<div data-testid="three-fallback">No model</div>}
      />,
    );

    expect(screen.getByTestId("three-fallback")).toBeInTheDocument();
  });

  test("renders canvas when model URL is provided", () => {
    render(<ThreeViewer modelUrl="/models/chair.glb" />);

    expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
  });
});
