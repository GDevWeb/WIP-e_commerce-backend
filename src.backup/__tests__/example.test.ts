describe("Jest Configuration", () => {
  test("Should work", () => {
    expect(1 + 1).toBe(2);
  });
});

test("Should support async", async () => {
  const result = await Promise.resolve("success");
  expect(result).toBe("success");
});
