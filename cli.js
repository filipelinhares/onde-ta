#!/usr/bin/env node
'use strict';

var spinner = require('elegant-spinner');
var logUpdate = require('log-update');
var frame = spinner();
var got = require('got');
var chalk = require('chalk');
var strl = require('string-length');
var repeat = require('repeating');
var meow = require('meow');
var animation;
var CODE_REGEX = /[a-z]{2}[0-9]{9}[a-z]{2}/ig;

var cli = meow({
  help: [
    'Usage',
    '  $ onde-ta 12312bc2321br'
  ]
});

if (!cli.input[0] || !CODE_REGEX.test(cli.input[0])) {
  cli.showHelp();
  process.exit(1);
}

function loading() {
  // Will start a fancy loading animation
  frame = spinner();
  animation = setInterval(function () {
    logUpdate(frame());
  }, 100);
}

function loaded() {
  clearInterval(animation);
}

function parse(data) {
  var longestLine = Math.max(strl(data.data), strl(data.local), strl(data.acao), strl(data.detalhes));

  // 14 is the size of the rest of the texts
  var bottomSize = longestLine + 14;
  var topSize = bottomSize - strl(data.data) - 2;

  var output = [
    chalk.yellow('┌ ') + chalk.bold(data.data) + ' ' + chalk.yellow(repeat('─', topSize)) + chalk.yellow('┐'),
    ' ⇢ Local:    ' + chalk.bold(data.local),
    ' ⇢ Ação:     ' + chalk.bold(data.acao),
    ' ⇢ Detalhes: ' + chalk.bold(data.detalhes),
    chalk.yellow('└') + chalk.yellow(repeat('─', bottomSize)) + chalk.yellow('┘')
  ];

  loaded();
  return logUpdate(output.join('\n'));
}

loading();
got('http://developers.agenciaideias.com.br/correios/rastreamento/json/' + cli.input[0], {json: true})
  .then(function (response) {
    console.log(typeof response.body);
    if (Array.isArray(response.body)) {
      response.body.forEach(function (data) {
        parse(data);
      });
    } else {
      console.log(chalk.red.bold('Houve algum erro, seu código está correto? ' + cli.input[0]));
    }
  })
  .catch(function () {
    console.log(chalk.red.bold('Houve algum erro, seu código está correto? ' + cli.input[0]));
    process.exit(1);
  });
