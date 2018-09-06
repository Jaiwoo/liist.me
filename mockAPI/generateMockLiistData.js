/* eslint-disable no-console */

const jsf = require('json-schema-faker');
const liistSchema = require('./mockLiistSchema');
// const schema = require('./mockDataSchema');
const fs = require('fs');
const chalk = require('chalk');

// plug Faker library to JSF
jsf.extend('faker', function() {
  return require('faker');
});

const json = JSON.stringify(jsf(liistSchema));

fs.writeFile('./mockAPI/db.json', json, function (err) {
  if (err) {
    return console.log(chalk.red(err));
  } else {
    console.log(chalk.green('Mock data generated.'));
  }
});