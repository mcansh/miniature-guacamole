import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import Login from "~/routes/login";

it("renders the login button", () => {
  const { getByText } = render(<Login />);
  expect(getByText(/sign in to apple music/i)).toBeDefined();
});
