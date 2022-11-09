import {LogExecutionContext} from '@franzzemen/logger-adapter';
import {ApplicationScope} from '@franzzemen/re-application';
import {RulesEngineParser} from '../parser/rules-engine-parser.js';
import {ReRulesEngine} from './rules-engine-execution-options.js';

export class RulesEngineScope extends ApplicationScope {
  static ReParser = 'ReParser';

  constructor(options?: ReRulesEngine, ec?: LogExecutionContext) {
    super(options, undefined, ec);
    this.set(RulesEngineScope.ReParser, new RulesEngineParser());
  }

  get options(): ReRulesEngine {
    return this._options;
  }
}
