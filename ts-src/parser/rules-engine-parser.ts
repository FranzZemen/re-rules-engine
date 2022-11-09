import {LogExecutionContext, LoggerAdapter} from '@franzzemen/logger-adapter';
import {ApplicationParser, ApplicationReference, ApplicationScope} from '@franzzemen/re-application';
import {ParserMessages, Scope} from '@franzzemen/re-common';
import {DelegateOptions, RuleContainerParser, RuleOptionOverrides} from '@franzzemen/re-rule';
import {RulesEngineReference} from '../rules-engine-reference.js';
import {ReRulesEngine, RulesEngineOptions} from '../scope/rules-engine-execution-options.js';
import {RulesEngineScope} from '../scope/rules-engine-scope.js';
import {RulesEngineHintKey} from '../util/rules-engine-hint-key.js';


const rulesEngineHintPrefix = 're';

/**
 * The RulesEngineParser is used to parse entire rules engine repositories.  It is "the" top level parser.
 */
export class RulesEngineParser extends RuleContainerParser<RulesEngineReference> {

  constructor() {
    super(RulesEngineHintKey.RulesEngine, []);
  }

  protected createScope(options?: ReRulesEngine, parentScope?: Scope, ec?: LogExecutionContext): RulesEngineScope {
    return new RulesEngineScope(options, ec);
  }

  protected createReference(refName: string, options: ReRulesEngine): RulesEngineReference {
    return {
      refName: 'RulesEngine.Engine',
      applications: [],
      options
    };
  }

  protected delegateParsing(ref: RulesEngineReference, near: string, scope: RulesEngineScope, ec?: LogExecutionContext): [string, ParserMessages] {
    const log = new LoggerAdapter(ec, 'rules-engine', 'rules-engine-parser', 'delegateParsing');
    let remaining = near;
    // The remaining text format must fully be digested by the remaining text, and pass in hints or returned hints from further down
    // must be Application hints (until there's another top level rule container or other artifact)
    while (remaining.length > 0) {
      const appParser: ApplicationParser = new ApplicationParser();
      let appReference: ApplicationReference, appScope: ApplicationScope, parserMessages: ParserMessages;
      let delegateOptions: DelegateOptions;
      let appOverrides: RuleOptionOverrides[] = (scope?.options as ReRulesEngine)?.['re-rules']?.applicationOverrides;
      if (appOverrides && appOverrides.length > 0) {
        delegateOptions = {overrides: appOverrides};
      }
      [remaining, appReference, parserMessages] = appParser.parse(remaining, delegateOptions, scope, ec);
      if (appReference) {
        ref.applications.push(appReference);
      } else if (remaining.length > 0) {
        // It is expected that a properly formatted Text representation will have fully consumed input.
        let err = new Error(`Unexpected tokens near "${near}" and before "${remaining}"`);
        log.error(err);
        throw err;
      }
    }
    if (remaining.length > 0) {
      let err = new Error(`Unexpected tokens near "${near}" and before "${remaining}"`);
      log.error(err);
      throw err;
    } else {
      return [remaining, undefined];
    }
  }

}
