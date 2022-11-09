import {cwd} from 'node:process';
import * as gulpBase from '@franzzemen/gulp-base';
import {createRequire} from 'module';
import {join, dirname} from 'node:path';
import {npmu as npmuFunc} from '@franzzemen/npmu';
import {fileURLToPath} from 'url';
import { simpleGit, CleanOptions } from 'simple-git';
import {inspect} from 'util';

const requireModule = createRequire(import.meta.url);
gulpBase.init(requireModule('./package.json'), cwd() + '/tsconfig.src.json', cwd() + '/tsconfig.test.json', 100);
gulpBase.setMainBranch('main');


const options = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
  trimmed: false,
};


const git = simpleGit(options);

const branches = await git.branchLocal();

if(branches && branches.current) {
  gulpBase.setMainBranch(branches.current);
}
/*
console.log(inspect(branches, true, 10, true));

  git.branchLocal()
  .then(branches => {
    console.log(inspect(branches, true, 10, true));
  });


 */


export const npmu = (cb) => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  
  npmuFunc([
    {
      path: join(__dirname, '../gulp-base'), packageName: '@franzzemen/gulp-base'
    }, {
      path: join(__dirname, '../npmu'), packageName: '@franzzemen/npmu'
    }, {
      path: join(__dirname, '../module-factory'), packageName: '@franzzemen/module-factory'
    }, {
      path: join(__dirname, '../execution-context'), packageName: '@franzzemen/execution-context'
    }, {
      path: join(__dirname, '../app-execution-context'), packageName: '@franzzemen/app-execution-context'
    }, {
      path: join(__dirname, '../logger-adapter'), packageName: '@franzzemen/logger-adapter'
    }, {
      path: join(__dirname, '../enhanced-error'), packageName: '@franzzemen/enhanced-error'
    }, {
      path: join(__dirname, '../module-resolver'), packageName: '@franzzemen/module-resolver'
    }, {
      path: join(__dirname, '../hints'), packageName: '@franzzemen/hints'
    }, {
      path: join(__dirname, '../rulesEngine-common'), packageName: '@franzzemen/rulesEngine-common'
    }, {
      path: join(__dirname, '../rulesEngine-data-type'), packageName: '@franzzemen/rulesEngine-data-type'
    }, {
      path: join(__dirname, '../rulesEngine-expression'), packageName: '@franzzemen/rulesEngine-expression'
    }, {
      path: join(__dirname, '../rulesEngine-condition'), packageName: '@franzzemen/rulesEngine-condition'
    }, {
      path: join(__dirname, '../rulesEngine-logical-condition'), packageName: '@franzzemen/rulesEngine-logical-condition'
    }, {
      path: join(__dirname, '../rulesEngine-rule'), packageName: '@franzzemen/rulesEngine-rule'
    }, {
      path: join(__dirname, '../rulesEngine-rule-set'), packageName: '@franzzemen/rulesEngine-rule-set'
    }, {
      path: join(__dirname, '../rulesEngine-application'), packageName: '@franzzemen/rulesEngine-application'
    }, {
      path: join(__dirname, './'), packageName: '@franzzemen/rulesEngine'
    }])
    .then(() => {
      console.log('cb...');
      cb();
    });
};


export const test = gulpBase.test;

export const clean = gulpBase.clean;
export const buildTest = gulpBase.buildTest;
export default gulpBase.default;

export const patch = gulpBase.patch;
export const minor = gulpBase.minor;
export const major = gulpBase.major;

export const npmForceUpdateProject = gulpBase.npmForceUpdateProject;
export const npmUpdateProject = gulpBase.npmUpdateProject;
