const { prompt_template_1, base_template, baseFields, templateFields, testVariables } = require('./data');
const { run } = require('./prompt-engine');

const prompt = run(prompt_template_1, base_template, baseFields, templateFields, testVariables);

console.log(prompt);