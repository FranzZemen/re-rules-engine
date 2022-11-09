
export * from './util/external-index.js';
export * from './rules-engine-reference.js';
export * from './rules-engine.js';
export * from './scope/external-index.js';
export * from './parser/external-index.js';
export * from './stringifier/external-index.js';





/*
const ec: LogExecutionContext = {
  log: {
  }
}

export function execute() {
  const log = new LoggerAdapter(ec, 're', 'index', 'execute');
  log.info(process.argv);
  const missingRuleError = new Error (`Missing command line argument: rule`);
  if(process.argv.length < 3) {
    log.error(missingRuleError);
    process.exit(1);
  }
  const ruleRegex = /^rule=[\s]*([^]+)$/;
  let result;
  const found = process.argv.find(arg => (result = ruleRegex.exec(arg)) !== null);
  if(found) {
    try {
      const rule = result[1];
      console.info(`rule: "${rule}"`);
      Rules.Engine.execute({}, rule, ec);
    } catch (err) {
      log.error(err);
    }
  } else {
    log.error(missingRuleError);
  }
}

if(process.argv.find(arg => arg.indexOf('rule=') >= 0) !== undefined) {
  execute();
}*/
