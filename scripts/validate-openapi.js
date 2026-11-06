const path = require("path");

const specificationPath = path.resolve(__dirname, "../docs/api/openapi.yaml");

const validateOpenApi = async () => {
  try {
    const { default: SwaggerParser } = await import("@apidevtools/swagger-parser");
    await SwaggerParser.validate(specificationPath);
    process.stdout.write("OpenAPI specification is valid.\n");
  } catch (error) {
    process.stderr.write(`OpenAPI validation failed: ${error.message}\n`);
    process.exitCode = 1;
  }
};

validateOpenApi();
