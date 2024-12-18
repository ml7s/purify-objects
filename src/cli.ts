#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import cleanObject from './index';

interface CliOptions {
  inputFile: string;
  outputFile: string | null;
  compareMode: boolean;
  safeMode: boolean;
}

const extractCliOptions = (args: string[]): CliOptions => ({
  inputFile: args[0],
  outputFile: args.indexOf('--output') !== -1 
    ? args[args.indexOf('--output') + 1] 
    : null,
  compareMode: args.includes('--compare'),
  safeMode: args.includes('--safe')
});

const generateFieldMap = (original: any, cleaned: any, prefix = ''): string[] => (
  Object.entries(original).reduce((acc: string[], [key, value]) => {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    
    if (!(key in cleaned)) {
      return [...acc, currentPath];
    }
    
    if (
      typeof value === 'object' && 
      value !== null &&
      typeof cleaned[key] === 'object' && 
      cleaned[key] !== null
    ) {
      return [...acc, ...generateFieldMap(value, cleaned[key], currentPath)];
    }
    
    return acc;
  }, [])
);

const executeCliOperation = (options: CliOptions): void => {
  const { inputFile, outputFile, compareMode, safeMode } = options;
  
  if (!inputFile) {
    console.error(chalk.red('Please provide an input JSON file'));
    console.log(chalk.yellow('Usage: npx purify-objects input.json [--output cleaned.json] [--compare] [--safe]'));
    process.exit(1);
  }
  
  try {
    const inputPath = path.resolve(process.cwd(), inputFile);
    const sourceData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const processedData = cleanObject(sourceData, undefined, [], { safe: safeMode });
    
    if (compareMode) {
      safeMode && console.log(chalk.blue('\nSafe Mode: Original object will not be modified'));
      console.log(chalk.yellow('\nOriginal object:'), JSON.stringify(sourceData, null, 2));
      console.log(chalk.green('\nCleaned object (preview):'), JSON.stringify(processedData, null, 2));
      
      const modifications = generateFieldMap(sourceData, processedData);
      if (modifications.length) {
        console.log(chalk.red('\nFields to be removed:'));
        modifications.forEach(f => console.log(chalk.red(`- ${f}`)));
      }
      
      safeMode && console.log(chalk.blue('\nNo changes were made to the original file (Safe Mode)'));
      process.exit(0);
    }
    
    if (outputFile) {
      const outputPath = path.resolve(process.cwd(), outputFile);
      fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2));
      safeMode && console.log(chalk.blue('Safe Mode: Created new file without modifying original'));
      console.log(chalk.green(`Cleaned JSON saved to ${outputFile}`));
      return;
    }
    
    console.log(JSON.stringify(processedData, null, 2));
  } catch (error: any) {
    console.error(chalk.red('Error:'), error?.message || 'Unknown error occurred');
    process.exit(1);
  }
};

executeCliOperation(extractCliOptions(process.argv.slice(2))); 