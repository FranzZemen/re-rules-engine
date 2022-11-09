/*
Created by Franz Zemen 11/07/2022
License Type: MIT
*/
import {LogExecutionContext, LoggerAdapter} from '@franzzemen/logger-adapter';
import {Application, ApplicationResult, isApplication} from '@franzzemen/re-application';
import {ParserMessages, RuleElementFactory, RuleElementReference, Scope} from '@franzzemen/re-common';
import {Rule} from '@franzzemen/re-rule';
import {RuleSet} from '@franzzemen/re-rule-set';
import {isPromise} from 'node:util/types';
import {RulesEngineParser} from './parser/rules-engine-parser.js';
import {RulesEngineReference} from './rules-engine-reference.js';
import {ReRulesEngine, RulesEngineOptions} from './scope/rules-engine-execution-options.js';
import {RulesEngineScope} from './scope/rules-engine-scope.js';


export interface ReResult {
  valid: boolean;
  applicationResults: ApplicationResult[];
}


export class RulesEngine extends RuleElementFactory<Application> {
  private scope: RulesEngineScope;
  private options: ReRulesEngine;

  public constructor(options?: ReRulesEngine, ec?: LogExecutionContext) {
    super();
    // The top level structural scope is type Global of name Global
    this.scope = new RulesEngineScope(options, ec);
    this.options = options;
  }

  to(ec?: LogExecutionContext): RulesEngineReference {
    /*
    const rulesEngineRef: RulesEngineReference = {refName: 'RulesEngine.Engine', options: this.options, applications: []};
    this.getApplications().forEach(application => rulesEngineRef.applications.push(application.to(ec)));
    return rulesEngineRef;*/
    return undefined;
  }

  isC(obj: any): obj is Application {
    return isApplication(obj);
  }

  register(reference: RuleElementReference<Application>, ec?: LogExecutionContext, ...params): Application {
    throw new Error('Do not use this method, use addApplication instead');
  }

  unregister(refName: string, ec?: LogExecutionContext): boolean {
    throw new Error('Do not use this method, use removeApplication instead');
  }

  getRegistered(name: string, ec?: LogExecutionContext): Application {
    const log = new LoggerAdapter(ec, 're', 're','getRegistered');
    log.warn('Do not use this method, use getApplication instead');
    return super.getRegistered(name,ec);
  }

  addApplication(app: Application, ec?: LogExecutionContext) {
    app.scope.reParent(this.scope);
    super.register({instanceRef: {refName: app.refName, instance: app}}, ec);
  }

  getApplication(refName: string, ec?: LogExecutionContext): Application {
    return super.getRegistered(refName, ec);
  }

  getApplications(ec?: LogExecutionContext): Application [] {
    return this.getAllInstances();
  }

  removeApplication(refName: string, ec?: LogExecutionContext) {
    const app: Application = super.getRegistered(refName, ec);
    if (app) {
      app.scope.removeParent(ec);
      return super.unregister(refName, ec);
    }
  }

  /**
   * This method executes all the rules in the RulesEngine Engine Scope
   * @param dataDomain
   * @param ec
   */
  awaitEvaluation(dataDomain: any, ec?: LogExecutionContext): ReResult | Promise<ReResult> {
    const log = new LoggerAdapter(ec, 're', 'rules', 'awaitEvaluation');
    const applicationResults: ApplicationResult[] = [];
    const applicationResultsPromises: Promise<ApplicationResult>[] = [];
    let hasPromises = false;
    this.repo.forEach(element => {
      const application: Application = element.instanceRef.instance;
      const result = application.awaitEvaluation(dataDomain, ec);
      if (isPromise(result)) {
        hasPromises = true;
        applicationResults.push(undefined);
        applicationResultsPromises.push(result);
      } else {
        applicationResults.push(result);
        applicationResultsPromises.push(undefined);
      }
    });
    if (hasPromises) {
      return Promise.all(applicationResultsPromises)
        .then(settledPromises => {
          settledPromises.forEach((settled, index) => {
            if (settled !== undefined) {
              applicationResults[index] = settled;
            }
          });
          return {
            applicationResults,
            valid: applicationResults.every(result => result.valid === true)
          };
        });
    } else {
      return {
        applicationResults,
        valid: applicationResults.every(result => result.valid === true)
      };
    }
  }

  execute(domain: any, text: string, ec?: LogExecutionContext): ReResult | Promise<ReResult> {
    const truOrPromise = this.load(text, ec);
    if(isPromise(truOrPromise)) {
      truOrPromise
        .then(truVal => {
          return this.awaitEvaluation(domain, ec);
        })
    } else {
      return this.awaitEvaluation(domain, ec);
    }
  }


  load(text: string, ec?: LogExecutionContext): [true, ParserMessages] | Promise<[true, ParserMessages]> {
    const parser = new RulesEngineParser();
    let [remaining, ref, parserMessages] = parser.parse(text, {options: this.scope.options},undefined, ec);
    // The combination of the current options in scope, which was originally initialized by them, along with the merge of those
    // Into loaded options, becomes the options for this scope recreated through parsing.
    this.scope = ref.loadedScope;
    const truOrPromise = Scope.resolve(this.scope, ec);
    if(isPromise(truOrPromise)) {
      return truOrPromise
        .then(truVal => {
          ref.applications.forEach(appRef => this.addApplication(new Application(appRef, this.scope, ec)));
          return [true, parserMessages];
        })
    } else {
      ref.applications.forEach(appRef => this.addApplication(new Application(appRef, this.scope, ec)));
      return [true, parserMessages];
    }
  }

  clear() {
    this.repo.clear();
  }

  findFirstRuleSet(ruleSetName, ec?: LogExecutionContext): RuleSet {
    const applications = this.getApplications(ec);
    for (let i = 0; i < applications.length; i++) {
      const ruleSet = applications[i].getRuleSet(ruleSetName, ec);
      if (ruleSet) {
        return ruleSet;
      }
    }
  }

  /**
   * Note this has runtime of [count of rule sets] * [count of rules in rule sets]
   * @param ruleName
   * @param ec
   */
  findFirstRule(ruleName: string, ec?: LogExecutionContext): Rule {
    const applications = this.getApplications(ec);
    for (let i = 0; i < applications.length; i++) {
      const ruleSets = applications[i].getRuleSets();
      for (let j = 0; j < ruleSets.length; j++) {
        const rule = ruleSets[j].getRule(ruleName, ec);
        if (rule) {
          return rule;
        }
      }
    }
  }
}
