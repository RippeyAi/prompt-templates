const { prompt_template_1, prompt_template_2, baseFields, templateFields, testVariables } = require('./data');
const { run } = require('./prompt-engine');

const prompt = run(prompt_template_1, prompt_template_2, baseFields, templateFields, testVariables);

console.log(prompt);