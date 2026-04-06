import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LibraryPage from "../../src/components/LibraryPage";

vi.mock("../../src/components/ImportFiles", () => ({
  default: () => <div data-testid="import-files">Import modal</div>,
}));

describe("LibraryPage", () => {
  it("renders a saved book cover from page image data", () => {
    render(
      <LibraryPage
        mode="edit"
        books={[
          {
            title: "My Story",
            pages: [{ id: "page-1", image_url: "https://example.com/page-1.png" }],
          },
        ]}
        onBack={vi.fn()}
        onOpenBook={vi.fn()}
        onBookUploaded={vi.fn()}
      />
    );

    expect(screen.getByRole("img", { name: "My Story cover" })).toHaveAttribute(
      "src",
      "https://example.com/page-1.png"
    );
  });

  it("only shows the upload button in edit mode", () => {
    const { rerender } = render(
      <LibraryPage
        mode="read"
        books={[]}
        onBack={vi.fn()}
        onOpenBook={vi.fn()}
        onBookUploaded={vi.fn()}
      />
    );

    expect(screen.queryByRole("button", { name: "Upload Book" })).not.toBeInTheDocument();

    rerender(
      <LibraryPage
        mode="edit"
        books={[]}
        onBack={vi.fn()}
        onOpenBook={vi.fn()}
        onBookUploaded={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "Upload Book" })).toBeInTheDocument();
  });

  it("opens the import modal from the upload button", async () => {
    const user = userEvent.setup();

    render(
      <LibraryPage
        mode="edit"
        books={[]}
        onBack={vi.fn()}
        onOpenBook={vi.fn()}
        onBookUploaded={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "Upload Book" }));

    expect(screen.getByTestId("import-files")).toBeInTheDocument();
  });
});
