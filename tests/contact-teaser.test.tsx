import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ContactTeaser } from "@/components/shared/ContactTeaser";

describe("ContactTeaser", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders contact form fields correctly", () => {
    render(<ContactTeaser />);
    
    expect(screen.getByRole("textbox", { name: /Name/i })).toBeInTheDocument();
  });

  test("submits contact form with user input", async () => {
    const fetchSpy = jest.spyOn(window, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    render(<ContactTeaser />);
    
    // Fill required fields
    fireEvent.change(screen.getByRole("textbox", { name: /Name/i }), { target: { value: "Test User" } });
    fireEvent.change(screen.getByRole("textbox", { name: /City/i }), { target: { value: "Test City" } });
    fireEvent.change(screen.getByRole("textbox", { name: /Phone or Email/i }), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByRole("textbox", { name: /Brief/i }), { target: { value: "Project Brief" } });

    // Submit the form
    fireEvent.submit(screen.getByRole("form", { name: /Project brief enquiry/i }));

    expect(fetchSpy).toHaveBeenCalled();
  });
});
