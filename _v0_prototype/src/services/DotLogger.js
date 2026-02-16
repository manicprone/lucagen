
export default {
  level: 5,
  main,
  sub,
};

function main(module = null, message = '') {
  const moduleLabel = `${module}()`;

  return console.log(`\n${moduleLabel}${message}\n\n`);
}

function sub(module = null, message = '', object = null) {
  const moduleLabel = (module) ? `${module} - ` : '';

  if (object) return console.log(`   ${moduleLabel} ${message} =>`, object);
  return console.log(`   ${moduleLabel} ${message}`);
}
