# json-faker
This application creates json with fake contextual data. It takes input as a template.

## Getting Started

```
npm install json-faker
```

## How to Use

#### Node.js

```
var JsonFaker = require('json-faker');
```

Create template file which will be used to generate JSON output:

Sample.json :

```
{
    "prop1": "@faker.address.state()",
    "prop2": "Sample String"
}
```

Generate Mock Data

```
var template = {
	"prop1": "@faker.address.state()",
    "prop2": "Sample String"
}
var fakeJSON = JsonFaker.process(template);
```
Output

```
{ "prop1": "MarLand", "prop2": "Sample String" }  
```

#### Browser

###### Note: Reading json object from file won't work inside browser

```
<script src = "node_modules/json-faker/build/json-faker.js" type = "text/javascript"></script>
<script>
  var stringTemplate = '{ "prop1": "@faker.address.city()", "prop2":"string here" }';
  var result = jsonFaker.process(stringTemplate);
  console.log(result);
</script>
```


Use faker for creating templates,
'@faker.object.function()'
any valid object.function() provided by faker will be processed to generate values.

for more information [Faker API Doc](https://www.npmjs.com/package/faker)

## Available Functions

 * process()
 * post()
 * put()
 * delete()


### JsonFaker.process(inputTemplate)
Process the json template and return json object with faker data

```
Input  -> String / Object / json file
Output -> JSON object
```

###### Example:
###### Object String

```
var stringTemplate = '{ "name": "@faker.address.findName()", "city":"@faker.name.city()" }';
var fakeJson = JsonFaker.process(stringTemplate); // returns object
```
Output

```
{
  "name": "Jay",
  "city": "MaryLand"
}
```

###### Object

```
var objectTemplate = {
    prop1: "@faker.address.city()"
}

var output = JsonFaker.process(objectTemplate); // returns object
```
Output
```
{
  "prop1": "MaryLand"
}
```

###### File

```
var templateFile = 'Sample.json';

var output = JsonFaker.process(templateFile); // returns object
```
Output
```
{
  "prop1": "MaryLand"
}
```
### JsonFaker.post(inputTemplate)
Returns object with extra property id

Input

```
var postArg = {
  prop1: 'Some string',
  prop2: 123,
  prop3: ['abc', 'cde']
};

var output = JsonFaker.post(postArg);
```

Output
```
{
  "id": 123456,
  "prop1": "Some string",
  "prop2": 123,
  "prop3": [
    "abc",
    "cde"
  ]
}
```



## Available Options

##### Single string
Input
```
{
  "name": "@faker.name.findName()"
}
```  
Output
```
{
  "name": "Mrs. Gia Bradtke"
}
```

##### Array of String


Input
```
{
  "nameList": [{{repeat 5}}"@faker.name.findName()"{{/repeat}}]
}
```  
Output
```
  {
  "nameList": [
    "Mrs. Gia Bradtke",
    "Idell Purdy",
    "Missouri Beatty",
    "Jessika Ankunding",
    "Mallory Crist"
  ]
}

```
You can use {{repeat <count>}} to any valid Faker strings `@faker.object.function()` when you are creating templates.

##### Include other json (or) template files as values

sample-template.json

```
{
  "name": "@faker.name.findName()",
  "companyName": "@faker.company.companyName()",
  "team": [{{repeat 5}}"@faker.name.findName()"{{/repeat}}]
}
```

Input
```
{
  "personDetails": "@faker.file.name('sample-template.json')"
}
```  
Output
```
{
  "personDetails": {
    "name": "Mallory Crist",
    "companyName": "Wisoky, Barton and Greenholt",
    "team": [
      "Mr. Fae Stanton",
      "Mr. Manuel Gibson",
      "Elliott Wilkinson",
      "Guy Graham",
      "Jermaine Collins"
    ]
  }
}

```

##### Creating array of values based on files

Input
```
{
  "personDetails": [{{repeat 2}}"@faker.file.name('sample-template.json')"{{/repeat}}]
}
```
Output
```
{
  "personDetails": [
    {
      "name": "Ryley Walsh",
      "companyName": "Runte, Roob and Kub",
      "team": [
        "Nico Tromp",
        "Enrico Beer",
        "Tyrel McLaughlin",
        "Waino O'Conner",
        "Louvenia Watsica"
      ]
    },
    {
      "name": "Joany Rempel",
      "companyName": "Cummings, Hahn and Lynch",
      "team": [
        "Major Krajcik V",
        "Dane Roob",
        "Efrain Boyer",
        "Halle Stokes",
        "Modesta Walter"
      ]
    }
  ]
}
```

Processing user data with template

```
var myData = {
	personDetails: {
  		"name": "Mallory Crist",
  		"companyName": "Wisoky, Barton and Greenholt"
   }     
}
```

Input
```
var template = {
    "prop1": "@faker.address.state()",
    "prop2": "Sample String",
    "prop3": "{{personDetails.name}} , {{ personDetails.companyName }}"
}

var fakeJson = JsonFaker.process(template, myData); // returns object
```
Output
```
{
  "prop1": "MaryLand",
  "prop2": "Sample String",
  "prop3": "Mallory Crist , Wisoky, Barton and Greenholt"
}
````

Array Repeat

Input
```
{
	"prop1": [
      {{repeat 2}}
      {
      "prop2": "{{@index}}",
      "prop3": "@faker.name.findName()",
      "prop4": "3242"
      }
      {{/repeat}}
     ]
}     
  ````      
Output
```
{
  "prop1": [
    {
      "prop2": "1",
      "prop3": "John",
      "prop4": "3242"
    },
    {
      "prop2": "2",
      "prop3": "Deo",
      "prop4": "3242"
    }
  ]
}
```

 TODO:

 Index for repeat

 Nested repeat template processing
