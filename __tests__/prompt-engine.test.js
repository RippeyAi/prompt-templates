const path = require("path");
const fs = require("fs");
const PromptEngine = require("../src/lib/engine");

// Helper function to get all test data directories
function getTestDataDirectories() {
  const dataDir = path.join(__dirname, "../data");
  const entries = fs.readdirSync(dataDir, { withFileTypes: true });
  
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}

// Helper function to load test data from a specific directory
function loadTestData(directoryName) {
  const testDataPath = path.join(__dirname, "../data", directoryName);

  const template = require(path.join(testDataPath, "template.js"));
  const templateFields = require(path.join(testDataPath, "fields.js"));
  const expectedOutput = fs.readFileSync(
    path.join(testDataPath, "expected_output.txt"),
    "utf8"
  );

  return {
    testDataPath,
    template,
    templateFields,
    expectedOutput: expectedOutput.trim(),
  };
}

describe("Prompt Engine", () => {
  let composer;
  const testDirectories = getTestDataDirectories();

  afterEach(() => {
    if (composer) {
      composer.clear();
    }
  });

  // Generate tests for each directory in data/
  testDirectories.forEach(directoryName => {
    describe(`Testing ${directoryName}`, () => {
      let testData;

      beforeEach(() => {
        testData = loadTestData(directoryName);
      });

      test("should generate prompt and write output file", () => {
        const prompt = PromptEngine.runComposer({
          template: testData.template,
          templateFields: testData.templateFields,
        });

        expect(prompt).toBeDefined();
        expect(typeof prompt).toBe("string");
        expect(prompt.length).toBeGreaterThan(0);

        // Write the generated output to output.txt in the test directory
        const outputPath = path.join(testData.testDataPath, "output.txt");
        fs.writeFileSync(outputPath, prompt.trim());

        // Verify the file was created
        expect(fs.existsSync(outputPath)).toBe(true);
      });

      test("should match expected output", () => {
        const prompt = PromptEngine.runComposer({
          template: testData.template,
          templateFields: testData.templateFields,
        });

        // Write the generated output to output.txt
        const outputPath = path.join(testData.testDataPath, "output.txt");
        fs.writeFileSync(outputPath, prompt.trim());

        // Read the generated output file
        const generatedOutput = fs.readFileSync(outputPath, "utf8").trim();

        // Compare with expected output
        expect(generatedOutput).toBe(testData.expectedOutput);
      });

      test("should generate prompt with base template parameters", () => {
        const prompt = PromptEngine.runComposer({
          template: testData.template,
          baseTemplate: {},
          baseTemplateFields: [],
          templateFields: testData.templateFields,
        });

        expect(prompt).toBeDefined();
        expect(typeof prompt).toBe("string");
        expect(prompt.length).toBeGreaterThan(0);
      });
    });
  });
});
