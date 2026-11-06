const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

test("OpenAPI contract contains every public resource", () => {
  const specification = YAML.parse(
    fs.readFileSync(path.resolve(__dirname, "../docs/api/openapi.yaml"), "utf8"),
  );

  expect(specification.openapi).toBe("3.0.3");
  expect(Object.keys(specification.paths)).toEqual(
    expect.arrayContaining([
      "/health/live",
      "/health/ready",
      "/api/v1/books",
      "/api/v1/books/{id}",
      "/api/v1/books/{id}/ratings",
      "/api/v1/books/{id}/reviews",
    ]),
  );
});
