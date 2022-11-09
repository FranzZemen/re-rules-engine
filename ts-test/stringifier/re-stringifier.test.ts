/*
import chai from 'chai';
import 'mocha';
import {ReParser, ReScope, ReStringifier} from '../../publish/index.js';


const expect = chai.expect;
const should = chai.should();

const unreachableCode = false;

const parser = new ReParser();
const stringifier = new ReStringifier();

const scope = new ReScope();

describe('rulesEngine tests', () => {
    describe('core/application/stringifier/application-stringifier.test', () =>{
      it ('should stringify "5 = test <<ap name="Application2">> 6 < ab', done => {
        const [remaining, reReference] = parser.parse('<<ru name=Rule1>> 5 = test <<ap name="Application2">> <<ru name=Rule2>> 6 < ab');
        const stringified = stringifier.stringify(reReference, scope);
        stringified.should.equal('<<re name=RulesEngine.Engine>> <<ap name=Default>> <<rs name=Default>> <<ru name=Rule1>> 5 = test <<ap name=Application2>> <<rs name=Default>> <<ru name=Rule2>> 6 < ab');
        done();
      })
  })
})


*/
