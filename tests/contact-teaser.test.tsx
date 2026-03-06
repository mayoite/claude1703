import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ContactTeaser } from "@/components/shared/ContactTeaser";

describe("ContactTeaser", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("dispatches guided planner open event", () => {
    const dispatchSpy = jest.spyOn(window, "dispatchEvent");

    render(<ContactTeaser />);
    fireEvent.click(screen.getByRole("button", { name: /open guided planner/i }));

    expect(dispatchSpy).toHaveBeenCalled();
    const eventArg = dispatchSpy.mock.calls[0]?.[0];
    expect(eventArg).toBeInstanceOf(CustomEvent);
    expect((eventArg as CustomEvent).type).toBe("oando-assistant:open");
  });

  test("dispatches ai chatbot open event", () => {
    const dispatchSpy = jest.spyOn(window, "dispatchEvent");

    render(<ContactTeaser />);
    fireEvent.click(screen.getByRole("button", { name: /open ai chatbot/i }));

    expect(dispatchSpy).toHaveBeenCalled();
    const eventArg = dispatchSpy.mock.calls[0]?.[0];
    expect(eventArg).toBeInstanceOf(CustomEvent);
    expect((eventArg as CustomEvent).type).toBe("oando-chatbot:open");
  });
});
