/*
import {LogExecutionContext, LoggerAdapter} from '@franzzemen/logger-adapter';
import chai from 'chai';
import 'mocha';
import {isPromise} from 'node:util/types';
import {ReResult, Rules} from '../publish/index.js';

const expect = chai.expect;
const should = chai.should();

interface StockDomain1 {
  ticker: string,
  price: number,
  peRatio: number,
  canTrade: boolean,
  lastTick: string,
  reference: number
}

const ec: LogExecutionContext = {

  log: {
    options: {
      level: 'info',
      inspectOptions: {
        depth: 10
      },
      hideAppContext: true,
      hideRequestId: true,
      hideThread: true
    }
  }
};

describe('rulesEngine tests', () => {
  describe('documentation.test', () => {
    it('Example 1', () => {
      const log = new LoggerAdapter(ec, 're', 'documentation.test', 'Example 1');

      const domain: StockDomain1 = {
        ticker: 'ZEM',
        price: 5.0,
        peRatio: 20.0,
        canTrade: true,
        lastTick: '2020-10-24T09:30:00',
        reference: 1956
      };
      let result: ReResult = Rules.Engine.execute(domain, 'price < 6.99 and reference = 1956', ec) as ReResult;
      isPromise(result).should.be.false;
      result.valid.should.be.true;
      log.info({}, `result.valid is ${result.valid}`);
    });
  });
});


 */
