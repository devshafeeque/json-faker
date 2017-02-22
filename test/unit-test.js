var JsonFaker = require('../src/json-faker');
var expect = require('chai').expect;

describe('JSON Faker testing', function () {
  it('testing input object', function () {
    var inputTemplate = {
      prop1: '@faker.address.city()'
    };
    var result = JsonFaker.process(inputTemplate);
    expect(result).to.have.property('prop1').and.not.equal('@faker.address.city()');
  });

  it('testing input string object', function () {
    var stringInput = '{ "prop1": "@faker.address.city()", "prop2":"string here" }';
    var result = JsonFaker.process(stringInput);
    expect(result).to.have.property('prop1').and.not.equal('@faker.address.city()');
    expect(result).to.have.property('prop2').and.equal('string here');
  });

  it('testing input file which contains all use cases', function () {
    var inputFile = './test/test.json';
    var result = JsonFaker.process(inputFile);
    expect(result).to.have.property('level1Prop1').and.not.equal('@faker.address.state()');
    expect(result).to.have.property('level1Prop2').and.not.equal('@faker.address.state()');
    expect(result.level1Prop2).to.be.an('object');
    expect(result.level1Prop3).to.be.an('array');
    expect(result.level1Prop4).to.be.an('array');
    expect(result.level1Prop5).to.equal(123456);
    expect(result.level1Prop6).to.equal('test string');
    expect(result.level1Prop7).to.be.oneOf(['type1', 'type2', 'type3', 'type4']);
    expect(result.level1Prop8).to.be.an('object');
    expect(result.level1Prop9).to.equal('Invalid input');
    expect(result.level1Prop10).to.be.an('array');
    expect(result.level1Prop11).to.equal('infinit loop()');
    expect(result.level1Prop12).to.be.an('array');
    expect(result.level1Prop12[0]).to.equal('Invalid input');
    expect(result.level1Prop13).to.be.an('array');
    expect(result.level1Prop13.length).to.equal(2);
    expect(result.level1Prop14).to.be.NaN;
    expect(result.level1Prop15).to.equal("12");
  });

  it('testing invalid file name', function () {
    var inputString = 'abc.json';
    var result = JsonFaker.process(inputString);
    expect(result).to.equal('Invalid input');
  });

  it('testing invalid input', function () {
    var inputString = 'notvaliddatatype';
    var result = JsonFaker.process(inputString);
    expect(result).to.equal('Invalid input data');
  });

  it('testing post function with invalid input', function () {
    var postArg = 'invalidinput';

    var result = JsonFaker.post(postArg);
    expect(result.message).to.equal('Invalid input');
  });

  it('testing post function', function () {
    var postArg = {
      prop1: 'Some string',
      prop2: 123,
      prop3: ['abc', 'cde']
    };

    var result = JsonFaker.post(postArg);
    expect(result).to.have.property('prop1').and.equal('Some string');
    expect(result).to.have.property('prop2').and.equal(123);
    expect(result).to.have.property('id');
  });

  it('testing put function', function () {
    var putArg = {
      prop1: 'Some string',
      prop2: 123,
      prop3: ['abc', 'cde']
    };

    var result = JsonFaker.put(putArg);
    expect(result).to.have.property('prop1').and.equal('Some string');
    expect(result).to.have.property('prop2').and.equal(123);
    expect(result).to.have.property('id');
  });

  it('testing delete function', function () {
    var deleteArg = {
      prop1: 'Some string',
      prop2: 123,
      prop3: ['abc', 'cde']
    };

    var result = JsonFaker.delete(deleteArg);
    expect(result).to.have.property('prop1').and.equal('Some string');
    expect(result).to.have.property('prop2').and.equal(123);
    expect(result).to.have.property('id');
  });

  it('testing for repeat', function () {
    var inputObject = {
      prop1: '{{repeat 2}}2{{/repeat}}'
    };
    var result = JsonFaker.process(inputObject);
    expect(result.prop1).to.equal('2, 2');
  });

  it('testing for user template', function () {
    var inputObject = {
      prop1: 'Name {{person.firstName}} {{person.lastName}}',
      prop2: '{{@faker.address.state()}}'
    };

    var myTemplate = {
      person: {
        firstName: 'John',
        lastName: 'Doe'
      }
    };
    var result = JsonFaker.process(inputObject, myTemplate);

    expect(result.prop1).to.equal('Name John Doe');
    expect(result).to.have.property('prop2').and.not.equal('@faker.address.state()');
  });
});
