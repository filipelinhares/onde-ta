#!/usr/bin/env node
'use strict';

const got = require('got');
const chalk = require('chalk');
const strl = require('string-length');
const repeat = require('repeating');
const meow = require('meow');
const storage = require('./storage');
const updateNotifier = require('update-notifier');
const CODE_REGEX = /[a-z]{2}[0-9]{9}[a-z]{2}/ig;

const CORREIOS_SERVICE_URL = 'https://correios-tracking.now.sh/';

let command;
const bold = chalk.bold;

const cli = meow(`
  Como usar:
    $ onde-ta RE108441783BR

    Salvar e visualizar códigos de rastreio
    $ onde-ta RE108441783BR --save batman
    $ onde-ta batman

    Remover um código salvo
    $ onde-ta --remove batman
    $ onde-ta --clear

    Listar todos os códigos salvos
    $ onde-ta --list

   Opções
    -s, --save     Salva um código de rastreio com nome
    -r, --remove   Remove o código selecionado
    -c, --clear    Remove todos os códigos salvos
    -l, --list     Listar todos os códigos salvos com um nome
`,
  {
    alias: {
      s: 'save',
      r: 'remove',
      c: 'clear',
      l: 'list'
    }
  });

updateNotifier({pkg: cli.pkg}).notify();

function run() {
  if (!CODE_REGEX.test(cli.input[0]) && cli.input[0]) {
    command = storage.get(cli.input[0]);
  } else if (cli.input[0]) {
    command = cli.input[0];
  } else if (cli.flags.clear) {
    storage.clear();
  } else if (cli.flags.remove) {
    storage.del(cli.flags.remove);
  } else if (cli.flags.list) {
    storage.list();
  } else {
    cli.showHelp();
  }

  if (cli.flags.save) {
    storage.save(cli.flags.save, cli.input[0]);
  }
}

run(cli)

function parse(data) {
  // `data.detalhe` is optional
  data.detalhe = data.detalhe || '';

  // Check for the longest line
  const longestLine = Math.max.apply(Math, [data.data, data.local, data.descricao, data.detalhe, `${chalk.bold(data.local)} - ${chalk.bold(data.cidade)}, ${chalk.bold(data.uf)}`].map(strl));


  const bottomSize = longestLine + 2;
  const topSize = bottomSize - (strl(data.data) + strl(data.hora)) - 4;

  const details = (data.detalhe) ?
      `${data.descricao}
┆      ${data.detalhe}`
                :
                  data.descricao
                ;

  const output = `
├┈ • ┌ ${bold(data.data)} - ${bold(data.hora)} ${repeat('─', topSize)} ┐
┆      ${bold(data.local)} - ${bold(data.cidade)}, ${bold(data.uf)}
┆
┆      ${details}
┆    └ ${repeat('─', bottomSize)} ┘
┆`;

  return output;
}

function fetchTracking ({ url, userInput}) {
  got(url + userInput, { json: true })
    .then(function (response) {
      if (!response.body[0].erro) {
        let lastOnBot = response.body[0].evento.reverse();

        lastOnBot.forEach(function (data) {
          process.stdout.write(parse(data));
        });

      } else {
        process.stdout.write(chalk.red.bold('Erro! ' + response.body[0].erro));
      }
    })
    .catch(function (err) {
      if (cli.flags.verbose) process.stderr.write(err);
      process.stdout.write(chalk.red.bold('Erro!'));
      process.exit(1);
    });
}

fetchTracking({ url: CORREIOS_SERVICE_URL, userInput: command })

