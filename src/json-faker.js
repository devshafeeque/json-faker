var faker = require('faker');
var fs = require('fs');

class JsonFaker {
    constructor() {
        this.validValueTypes = ['object', 'json', 'jsonString'];
        this.fileList = [];
        this.userTemplate = {};
    }

    process(content, userTemplate) {
        this.userTemplate = userTemplate;
        var inputType = this._getInputType(content);
        if (!this.validValueTypes.includes(inputType)) return 'Invalid input data';

        if (inputType === 'json') this.fileList.push(content);

        var jsonObj = this._getJsonObj(content, inputType);
        if (jsonObj === 'Invalid input') return jsonObj;

        var getReturnData = this._generateMock(jsonObj);

        return getReturnData;
    };

    post(inputArg) {
        return this._createResponse(inputArg);
    };

    put(inputArg) {
        return this._createResponse(inputArg);
    };

    delete(inputArg) {
        return this._createResponse(inputArg);
    };

    _createResponse(inputObj) {
        if (typeof inputObj !== 'object') inputObj = {
            message: 'Invalid input'
        };
        else inputObj['id'] = faker.random.uuid();
        return inputObj;
    };

    _getInputType(input) {
        if(input == null) return null;
        if (typeof input === 'string') {
            input = this._processTemplate(input, typeof input);
            var fileExtension = input.split('.').pop();
            if (fileExtension === 'json') { // file type json
                return fileExtension;
            } else if (this._IsJsonString(input)) { // input string json object
                return 'jsonString';
            } else return 'string';
        } else if (input.constructor === Array) return 'array';
        else return typeof input;
    };

    _getJsonObj(input, inputType) {
        if (inputType === 'object') return input;
        var getContents = this._processTemplate(input, inputType);
        if (inputType === 'json') {
            try {
                return JSON.parse(getContents);
            } catch (e) {
                return 'Invalid input';
            }
        }
        if (inputType === 'jsonString') {
            return JSON.parse(getContents);
        }
    };

    _readArray(inputArray) {
        var newArray = [];
        var self = this;
        inputArray.forEach(function(element) {
            var valueType = self._getInputType(element);
            if (valueType === 'number') newArray.push(element);
            if (valueType === 'string') {
                let stringProcess = self._stringProcessing(element);
                newArray.push(self._getFakerData(stringProcess));
            }
            if (valueType === 'object') newArray.push(self._generateMock(element));
        });
        return newArray;
    };

    _generateMock(inputJson) {
        var returnData = {};
        var self = this;
        for (var property in inputJson) {
            if (inputJson.hasOwnProperty(property)) {
                var valueType = self._getInputType(inputJson[property]);
                if (valueType === null) returnData[property] = null;
                else if (valueType === 'string') {
                    let stringProcess = self._stringProcessing(inputJson[property]);
                    returnData[property] = self._getFakerData(stringProcess);
                } else if (valueType === 'number') {
                    returnData[property] = inputJson[property];
                } else if (valueType === 'object') {
                    returnData[property] = self._generateMock(inputJson[property]);
                } else if (valueType === 'array') {
                    returnData[property] = self._readArray(inputJson[property]);
                }
            }
        }
        return returnData;
    };

    _getFakerData(inputValue) {
        if (this._isFaker(inputValue)) {
            return this._createFakerData(inputValue);
        } else return inputValue;
    };

    _createFakerData(inputValue) {
        var regExp = /(.*)\((.*)\)\)?/;
        /*
        Example
        input => '@faker.name.findName('someArg')
        output =>
        [ '@faker.name.findName(\'someArg\')',
        '@faker.name.findName',
        '\'someArg\'',
        index: 0,
        input: '@faker.name.findName(\'someArg\')' ]
        */
        var [, fakerDef, funcArg] = inputValue.match(regExp);
        var getStructure = fakerDef.split('.');
        var returnData;
        if (getStructure[1] === 'file') {
            funcArg = funcArg.replace(/'/g, '');

            if (this.fileList.includes(funcArg)) return 'infinit loop()';
            else this.fileList.push(funcArg);

            var jsonObj = this._getJsonObj(funcArg, 'json');
            if (jsonObj === 'Invalid input') {
                this.fileList.pop(); // removing file from array after processing
                return jsonObj;
            }

            returnData = this._generateMock(jsonObj);
            this.fileList.pop(); // removing file from array after processing
            return returnData;
        } else {
            if (funcArg[0] === '[') { // checking if it is array
                funcArg = funcArg.replace(/'/g, '"');
                funcArg = JSON.parse(funcArg);
            }

            if (funcArg[0] === '{') { // checking if it is object
                try {
                    funcArg = JSON.parse(funcArg);
                } catch (err) {
                    // since JSON.parse threw an error, assume parameters was actually a string
                    funcArg = funcArg;
                }
            }
            returnData = faker[getStructure[1]][getStructure[2]](funcArg);
        }
        return returnData;
    };

    _isFaker(inputValue) {
        if (inputValue.split('.')[0] === '@faker') return true;
        else return false;
    };

    _processTemplate(input, inputType) {
        if (inputType === 'json') {
            input = this._readTemplateFile(input);
        }
        return this._repeatString(input);
    };

    _repeatString(input) {
        /*
        regEx = /{{repeat\s+(\d+)}}([\s\S]*?){{\/repeat}}/g
        {{repeat - a literal char sequence
        \s+ - 1+ whitespaces
        (\d+) - Group 1: one or more digits
        }} - literal }}
        ([\s\S]*?) - Group 2, any 0+ characters, as few as possible up to the first
        {{\/repeat}} - literal {{/repeat}}.
        */
        var res;
        var self = this;
        if (typeof input === 'string') {
            res = input.replace(/{{repeat\s+(\d+)}}([\s\S]*?){{\/repeat}}/g, function($0, $1, $2) {
                return self._fillArray($2.trim(), parseInt($1, 10)).join(', ');
            });
        }
        return res;
    };

    _readTemplateFile(path) {
        try {
            var data = fs.readFileSync(path);
            return data.toString();
        } catch (e) {
            return 'Invalid Input';
        }
    };

    _stringProcessing(inputString) {
        var self = this;
        inputString = this._repeatString(inputString);
        var result = inputString.replace(/\{{(.+?)\}}/gmi, function(match, textInside) {
            var objectProp = textInside.split('.');
            if (objectProp[0] === '@faker') return self._createFakerData(textInside);
            else {
                var obj = self.userTemplate;
                while (objectProp.length && (obj = obj[objectProp.shift()]));
                return obj;
            }
        });
        return result;
    };

    _IsJsonString(str) {
        if (!isNaN(Number(str))) return false;
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    _fillArray(s, num) {
        var arr = [];
        for (var i = 0; i < num; i++) {
            arr.push(s);
        }
        return arr;
    }
}
module.exports = new JsonFaker();
