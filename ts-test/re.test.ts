import 'mocha';
import chai from 'chai';
import {inspect} from 'node:util';
import {isPromise} from 'node:util/types';
import {RulesEngine, RulesEngineExecutionContext, validate} from '../publish/index.js';



const expect = chai.expect;
const should = chai.should();

const unreachableCode = false;

describe('re tests', () => {
  describe('re.test', () => {
    describe('general', () => {
      it('should executeRule "ticker = "ZEM" and price > 5.0"', () => {
        const dataDomain = {
          ticker: 'ZEM',
          price: 5.0
        };
        const rulesEngine = new RulesEngine();
        const result = rulesEngine.execute(dataDomain, 'ticker = "ZEM" and price > 5.0');
        if (isPromise(result)) {
          unreachableCode.should.be.true;
        } else {
          result.valid.should.be.false;
        }
      })
      it('should executeRule "ticker = "ZEM" and price >= 5.0"', () => {
       /* const rulesEngine = new RulesEngine();
        const dataDomain = {
          ticker: 'ZEM',
          price: 5.0
          const rulesEngine.execute(dataDomain, '<<ap name="second">> ticker = "ZEM" and price >= 5.0');
          if(isPromise(result)
      )
        {
          unreachableCode.should.be.true;
        }
      else
        {
          result.valid.should.be.true;
        }
      }*/
      });
    });
    describe('RulesEngineExecutionContext tests', () => {
      it('should validate', () => {
        let re: RulesEngineExecutionContext = {};
        let result = validate(re);
        if (result !== true) {
          console.log(inspect(result, false, 10, true));
        } else {
          console.log(inspect(re, false, 10, true));
          console.log(JSON.stringify(re));
        }
      });
    });
  });
})
