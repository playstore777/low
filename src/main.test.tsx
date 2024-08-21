import { describe, it, vi } from "vitest";

// Mock the ReactDOM.createRoot method entirely within the mock factory function
vi.mock("react-dom/client", () => {
  const renderMock = vi.fn();
  const createRoot = () => ({
    render: renderMock,
  });

  return {
    default: { createRoot },
    __esModule: true, // This line is important to ensure proper ES module handling
  };
});

// Import the root file after the mock
import "./main"; // Adjust the path according to your project structure
import ReactDOM from "react-dom/client";

describe("Root file", () => {
  it("calls ReactDOM.createRoot and renders the app without crashing", () => {
    // Ensure that the render method was called
    expect(
      ReactDOM.createRoot(document.getElementById("root")!).render
    ).toHaveBeenCalled();
  });
});
