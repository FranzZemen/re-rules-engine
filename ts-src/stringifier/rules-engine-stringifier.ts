import {LogExecutionContext} from '@franzzemen/logger-adapter';
import {ApplicationStringifier} from '@franzzemen/re-application';

import {RulesEngineReference} from '../rules-engine-reference.js';
import {RulesEngineScope} from '../scope/rules-engine-scope.js';
import {RulesEngineHintKey} from '../util/rules-engine-hint-key.js';
import {StringifyRulesOptions} from './stringify-rules-options.js';

export class RulesEngineStringifier {
  constructor() {
  }
  stringify(reReference: RulesEngineReference, scope: RulesEngineScope, options?: StringifyRulesOptions, ec?: LogExecutionContext) {
    let stringified;
    // TODO stringify options
    if(reReference.refName.indexOf(' ') < 0) {
      stringified = `<<${RulesEngineHintKey.RulesEngine} name=${reReference.refName}>>`;
    } else {
      stringified = `<<${RulesEngineHintKey.RulesEngine} name="${reReference.refName}">>`;
    }
    const applicationStringifier = new ApplicationStringifier();
    reReference.applications.forEach(application => {
      stringified += ` ${applicationStringifier.stringify(application, scope, options, ec)}`;
    });
    return stringified;
  }
}
