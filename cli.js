#!/usr/bin/env node
'use strict';
const got = require('got');
const chalk = require('chalk');
const strl = require('string-length');
const repeat = require('repeating');
const meow = require('meow');
const updateNotifier = require('update-notifier');
const storage = require('./storage');

const CODE_REGEX = /[\w]{2}[\d]{9}[\w]{2}/gi;

const { exit } = process;
const { bold, italic } = chalk;

const CORREIOS_SERVICE_URL =
  'https://correios-tracking.filipe.now.sh/api/track?code=';

const cli = meow(
  `
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
    flags: {
      save: {
        alias: 's',
      },
      remove: {
        alias: 'r',
      },
      clear: {
        alias: 'c',
      },
      list: {
        alias: 'l',
      },
    },
  },
);

function parse(data) {
  const { locale, status, observation } = data;

  // Check for the longest line
  const longestLine = Math.max(
    ...[
      locale.state,
      locale.city,
      observation.from,
      observation.to,
      `${bold(locale.city)}/${bold(locale.state)}`,
      `${chalk.bold(locale.city)}/${chalk.bold(locale.state)}`,
    ].map(strl),
  );

  const bottomSize = longestLine + 3;
  const topSize = bottomSize;

  const { from, to } = observation;

  const output = `
├┈ • [${bold(data.trackedAt)}]
┆
┆  ${bold(italic(status))}
┆
┆  ┌ ${repeat(topSize, '─')} ┐
┆     ${bold(locale.city)}/${bold(locale.state)}
┆     ${
  to
    ? `
┆    • ${from}
┆    ⇢ ${to}`
    : from.replace('-', '')
}
┆  └ ${repeat(bottomSize, '─')} ┘
┆`;

  return output;
}

function fetchTracking(command, flags) {
  got(CORREIOS_SERVICE_URL + command, { json: true })
    .then(function(response) {
      const { body } = response;

      if (body.error) {
        console.log(chalk.red.bold('ErroR! ' + response.body[0].erro));
      }

      let { tracks } = body;
      if (flags.last) {
        const [first] = tracks;
        tracks = [first];
      }

      tracks.forEach(function(data) {
        console.log(parse(data));
      });
    })
    .catch(function(error) {
      if (cli.flags.verbose) {
        console.log(error);
      }

      console.log(chalk.red.bold('Error!'));
      exit();
    });
}

process.on('SIGINT', function() {
  console.log(chalk.red.bold('\n Operação cancelada!'));
  exit();
});

updateNotifier({ pkg: cli.pkg }).notify();

function run() {
  if (!CODE_REGEX.test(cli.input[0]) && cli.input[0]) {
    fetchTracking(storage.get(cli.input[0]), cli.flags);
    exit();
  }

  if (cli.input[0]) {
    fetchTracking(cli.input[0], cli.flags);
    exit();
  }

  if (cli.flags.clear) {
    storage.clear();
    exit();
  }

  if (cli.flags.remove) {
    storage.del(cli.flags.remove);
    exit();
  }

  if (cli.flags.list) {
    storage.list();
    exit();
  }

  if (cli.flags.save) {
    storage.save(cli.flags.save, cli.input[0]);
    exit();
  }

  cli.showHelp();
}

run(cli);
