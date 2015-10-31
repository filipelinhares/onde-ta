'use strict';

var storage = require('node-persist');
var chalk = require('chalk');
var path = require('path');

storage.initSync({
  dir: path.resolve(__dirname, 'onde-ta-db')
});

exports.save = function (key, value) {
  storage.setItem(key, value, function () {
    console.log(chalk.green.bold('✔ Salvo ') + chalk.bold(value) + ' como ' + chalk.bold(key));
    storage.persistSync();
    process.exit(1);
  });
};

exports.get = function (key) {
  if (storage.getItemSync(key)) {
    return storage.getItemSync(key);
  }
  console.log(chalk.red('✖ Você ainda não salvou ' + chalk.bold(key) + ', use a flag ' + chalk.bold('"--save ' + key) + '" para isso.'));
  process.exit(1);
};

exports.del = function (key) {
  storage.removeItem(key, function () {
    console.log(chalk.red('✖ ' + chalk.bold(key) + ' removido com sucesso!'));
    storage.persistSync();
    process.exit(1);
  });
};

exports.clear = function () {
  storage.clear(function () {
    console.log(chalk.green('✔ Todos as encomendas foram apagadas'));
    storage.persistSync();
    process.exit(1);
  });
};

exports.list = function () {
  var packages = storage.keys();
  if (packages.length === 0) {
    console.log(chalk.red('✖ Você ainda não tem nenhuma encomenda cadastrada use a flag ' + chalk.bold('--save') + ' para isso.'));
    process.exit(1);
  }

  console.log(chalk.dim('Suas encomendas:'));
  packages.forEach(function (pack) {
    console.log(chalk.bold('⇢ ') + chalk.yellow(pack) + ' - ' + storage.getItemSync(pack));
    process.exit(1);
  });
};
