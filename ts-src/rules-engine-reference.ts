import {ApplicationReference} from '@franzzemen/re-application';
import {ScopedReference} from '@franzzemen/re-rule';
import {ReRulesEngine} from './scope/rules-engine-execution-options.js';

export interface RulesEngineReference extends ScopedReference {
  options: ReRulesEngine;
  applications: ApplicationReference[];
}
