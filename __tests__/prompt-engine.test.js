const { run } = require('../prompt-engine');
const { prompt_template_1, prompt_template_2, baseFields, templateFields, inputVariables } = require('../data');
const PromptComposer = require('../prompt-composer');

describe('Prompt Engine', () => {
  let composer;

  beforeEach(() => {
    composer = new PromptComposer();
    composer.registerBaseTemplate(prompt_template_2);
    composer.registerTemplate(prompt_template_1);
    composer.registerFields(prompt_template_2._id, baseFields);
    composer.registerFields(prompt_template_1._id, templateFields);
  });

  test('registers templates and fields correctly', () => {
    expect(composer.data.baseTemplates.has(prompt_template_2._id)).toBe(true);
    expect(composer.data.templates.has(prompt_template_1._id)).toBe(true);
    expect(composer.data.fields.get(prompt_template_2._id)).toHaveLength(baseFields.length);
    expect(composer.data.fields.get(prompt_template_1._id)).toHaveLength(templateFields.length);
  });

  test('composes key definition from fields', () => {
    const keyDef = composer.composeKeyDefinitionFromFields(prompt_template_1._id, prompt_template_2._id);
    const parsed = JSON.parse(keyDef);
    expect(Array.isArray(parsed)).toBe(true);
    expect(Object.keys(parsed[0])).toEqual([
      'file_type',
      'issuer_name',
      'vendor',
      'bill_of_lading_number',
      'bl_type',
      'scac_code',
      'mbl_number',
      'booking_number',
      'marks_and_numbers',
    ]);
  });

  test('renders prompt with composed key definition', () => {
    const prompt = composer.render(prompt_template_1._id, inputVariables);
    expect(prompt).toContain('Key Definitions:');
    expect(prompt).toContain('"file_type"');
    expect(prompt).toContain('"marks_and_numbers"');
    expect(prompt).toContain('USER:');
    expect(prompt).toContain('AI:');
  });

  test('run() returns a prompt string with all sections', () => {
    const prompt = run(prompt_template_1, prompt_template_2, baseFields, templateFields, inputVariables);
    expect(prompt).toContain('Key Definitions:');
    expect(prompt).toContain('AI:');
  });
}); 