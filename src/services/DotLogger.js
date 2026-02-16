// DotLogger.js — Logging service for dot simulation

export function main(module = null, message = '') {
  const moduleLabel = `${module}()`;
  console.log(`\n${moduleLabel}${message}\n\n`);
}

export function sub(module = null, message = '', object = null) {
  const moduleLabel = module ? `${module} - ` : '';
  if (object) {
    console.log(`   ${moduleLabel} ${message} =>`, object);
  } else {
    console.log(`   ${moduleLabel} ${message}`);
  }
}

export default { level: 5, main, sub };
