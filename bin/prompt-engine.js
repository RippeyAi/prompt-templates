#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const PromptEngine = require('../src/lib/engine');
const logger = require('../src/lib/utils/logger');

// Parse command line arguments
const args = process.argv.slice(2);
const usage = `
Usage: prompt-engine <command> [options]

Commands:
  generate <vendor> <template>  Generate a prompt for a specific vendor and template
  list                         List all available vendors and templates
  help                         Show this help message

Options:
  --output, -o    Output file path (default: stdout)
  --format, -f    Output format (json|text) (default: text)
  --verbose, -v   Enable verbose logging
  
Examples:
  prompt-engine generate koerber ap
  prompt-engine generate koerber ap -o output.txt
  prompt-engine list
`;

// Set up logging level based on verbose flag
if (args.includes('--verbose') || args.includes('-v')) {
    logger.level = 'debug';
}

function listTemplates() {
    logger.info('Listing available templates');
    const configPath = path.join(__dirname, '../config');
    
    // List vendors
    const vendors = fs.readdirSync(path.join(configPath, 'vendor'))
        .filter(f => fs.statSync(path.join(configPath, 'vendor', f)).isDirectory());
    
    console.log('\nAvailable templates:');
    vendors.forEach(vendor => {
        console.log(`\n${vendor}:`);
        const templates = fs.readdirSync(path.join(configPath, 'vendor', vendor))
            .filter(f => fs.statSync(path.join(configPath, 'vendor', vendor, f)).isDirectory());
        templates.forEach(template => {
            console.log(`  - ${template}`);
        });
    });
}

function generatePrompt(vendor, template, outputPath, format = 'text') {
    logger.info(`Generating prompt for vendor: ${vendor}, template: ${template}`);
    try {
        const prompt = PromptEngine.getPrompt(vendor, template);
        
        // Format output
        const output = format === 'json' ? JSON.stringify(prompt, null, 2) : prompt;
        
        // Write to file or stdout
        if (outputPath) {
            fs.writeFileSync(outputPath, output);
            logger.info(`Prompt written to ${outputPath}`);
        } else {
            console.log(output);
        }
    } catch (error) {
        logger.error(`Error generating prompt: ${error.message}`);
        process.exit(1);
    }
}

// Main command processing
function main() {
    if (args.length === 0 || args.includes('--help') || args.includes('-h') || args[0] === 'help') {
        console.log(usage);
        return;
    }

    const command = args[0];

    switch (command) {
        case 'list':
            listTemplates();
            break;

        case 'generate':
            if (args.length < 3) {
                console.error('Error: vendor and template arguments are required');
                console.log(usage);
                process.exit(1);
            }

            const vendor = args[1];
            const template = args[2];
            
            // Parse options
            const outputIndex = args.indexOf('--output') !== -1 
                ? args.indexOf('--output') 
                : args.indexOf('-o');
            const formatIndex = args.indexOf('--format') !== -1 
                ? args.indexOf('--format') 
                : args.indexOf('-f');
            
            const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : null;
            const format = formatIndex !== -1 ? args[formatIndex + 1] : 'text';

            generatePrompt(vendor, template, outputPath, format);
            break;

        default:
            console.error(`Unknown command: ${command}`);
            console.log(usage);
            process.exit(1);
    }
}

// Run the CLI
main(); 