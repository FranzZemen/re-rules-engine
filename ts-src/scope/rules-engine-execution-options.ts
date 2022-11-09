import {AppExecutionContextDefaults, appSchemaWrapper} from '@franzzemen/app-execution-context';
import {ExecutionContextDefaults, executionSchemaWrapper} from '@franzzemen/execution-context';
import {LogExecutionContextDefaults, logSchemaWrapper} from '@franzzemen/logger-adapter';
import {
  ApplicationExecutionContext, ApplicationExecutionContextDefaults,
  ApplicationOptions,
  applicationOptionsSchemaWrapper, ReApplication
} from '@franzzemen/re-application';
import {CommonExecutionContextDefaults, commonOptionsSchemaWrapper} from '@franzzemen/re-common';
import {ConditionExecutionContextDefaults, conditionOptionsSchemaWrapper} from '@franzzemen/re-condition';
import {DataTypeExecutionContextDefaults, dataTypeOptionsSchemaWrapper} from '@franzzemen/re-data-type';
import {ExpressionExecutionContextDefaults, expressionOptionsSchemaWrapper} from '@franzzemen/re-expression';
import {
  LogicalConditionExecutionContextDefaults,
  logicalConditionOptionsSchemaWrapper
} from '@franzzemen/re-logical-condition';
import {RuleExecutionContextDefaults, RuleOptionOverrides, ruleOptionsSchemaWrapper} from '@franzzemen/re-rule';
import {
  ruleOptionOverrideSchemaWrapper,
  RuleSetExecutionContextDefaults,
  ruleSetOptionsSchemaWrapper
} from '@franzzemen/re-rule-set';
import Validator, {ValidationError} from 'fastest-validator';
import {isPromise} from 'util/types';

export interface RulesEngineOptions extends ApplicationOptions {
  applicationOverrides?: RuleOptionOverrides[];
}


export interface ReRulesEngine extends ReApplication {
  're-rules-engine'?: RulesEngineOptions;
}

export interface RulesEngineExecutionContext extends ApplicationExecutionContext {
  re?: ReRulesEngine;
}

export class RulesEngineExecutionContextDefaults {
  static RulesEngineOptions: RulesEngineOptions = {};
  static ReRulesEngine: ReRulesEngine = {
    're-common': CommonExecutionContextDefaults.CommonOptions,
    're-data-type': DataTypeExecutionContextDefaults.DataTypeOptions,
    're-expression': ExpressionExecutionContextDefaults.ExpressionOptions,
    're-condition' : ConditionExecutionContextDefaults.ConditionOptions,
    're-logical-condition': LogicalConditionExecutionContextDefaults.LogicalConditionOptions,
    're-rule': RuleExecutionContextDefaults.RuleOptions,
    're-rule-set': RuleSetExecutionContextDefaults.RuleSetOptions,
    're-application': ApplicationExecutionContextDefaults.ApplicationOptions,
    're-rules-engine': RulesEngineExecutionContextDefaults.RulesEngineOptions
  };
  static RulesEngineExecutionContext: RulesEngineExecutionContext = {
    execution: ExecutionContextDefaults.Execution(),
    app: AppExecutionContextDefaults.App,
    log: LogExecutionContextDefaults.Log,
    re: RulesEngineExecutionContextDefaults.ReRulesEngine
  };
}

export const rulesEngineOptionsSchema = {
  ruleOptionOverrides: {type: 'array', optional: true, items: ruleOptionOverrideSchemaWrapper},
  ruleSetOptionOverrides: {type: 'array', optional: true, items: ruleOptionOverrideSchemaWrapper},
  applicationOverrides: {type: 'array', optional: true, items: ruleOptionOverrideSchemaWrapper}
};

export const rulesEngineOptionsSchemaWrapper = {
  type: 'object',
  optional: true,
  default: RulesEngineExecutionContextDefaults.RulesEngineOptions,
  props: rulesEngineOptionsSchema
};

const reRulesEngineSchema = {
  're-common': commonOptionsSchemaWrapper,
  're-data-type': dataTypeOptionsSchemaWrapper,
  're-expression': expressionOptionsSchemaWrapper,
  're-condition': conditionOptionsSchemaWrapper,
  're-logical-condition': logicalConditionOptionsSchemaWrapper,
  're-rule': ruleOptionsSchemaWrapper,
  're-ruleset': ruleSetOptionsSchemaWrapper,
  're-application': applicationOptionsSchemaWrapper,
  're-rules-engine': rulesEngineOptionsSchemaWrapper
};

export const reRulesEngineSchemaWrapper = {
  type: 'object',
  optional: true,
  default: RulesEngineExecutionContextDefaults.ReRulesEngine,
  props: reRulesEngineSchema
};


export const rulesEngineExecutionContextSchema = {
  execution: executionSchemaWrapper,
  app: appSchemaWrapper,
  log: logSchemaWrapper,
  re: reRulesEngineSchemaWrapper
};

export const rulesEngineExecutionContextSchemaWrapper = {
  type: 'object',
  optional: true,
  default: RulesEngineExecutionContextDefaults.RulesEngineExecutionContext,
  props: rulesEngineExecutionContextSchema
};


export function isRulesExecutionContext(options: any | RulesEngineExecutionContext): options is RulesEngineExecutionContext {
  return options && 're' in options && 'rules-engine' in options.re; // Faster than validate
}

const check = (new Validator({useNewCustomCheckerFunction: true})).compile(rulesEngineExecutionContextSchema);

export function validate(context: RulesEngineExecutionContext): true | ValidationError[] {
  const result = check(context);
  if (isPromise(result)) {
    throw new Error('Unexpected asynchronous on RulesEngineExecutionContext validation');
  } else {
    if (result === true) {
      context.validated = true;
    }
    return result;
  }
}


