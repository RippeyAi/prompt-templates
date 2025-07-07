const { run } = require('../prompt-engine');
const { prompt_template_1, prompt_template_2, baseFields, templateFields, inputVariables } = require('../data');
const PromptComposer = require('../prompt-composer');

describe('Prompt Engine', () => {
  let composer;

  beforeEach(() => {
    composer = new PromptComposer();
  
  });

  test('registers templates and fields correctly', () => {
   // not implemented yet
  });

}); 