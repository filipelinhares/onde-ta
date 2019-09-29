const path = require('path');
const os = require('os');
const storage = require('node-persist');
const chalk = require('chalk');
const { exit } = process;

storage.initSync({
  dir: path.resolve(os.homedir(), '.onde-ta'),
});

exports.save = function(key, value) {
  storage.setItem(key, value, function() {
    process.stdout.write(
      `${chalk.green('✔')} Salvo ${chalk.bold(value)} como ${chalk.bold(key)}`,
    );
    storage.persistSync();
    exit();
  });
};

exports.get = function(key) {
  if (storage.getItemSync(key)) {
    return storage.getItemSync(key);
  }

  process.stderr.write(
    `${chalk.red('✖')} ${chalk.bold(key)} não existe, use ${chalk.bold(
      'onde-ta --save SEU_CÓDIGO',
      key,
    )} para criar`,
  );
  exit();
};

exports.del = function(key) {
  storage.removeItem(key, function() {
    process.stdout.write(
      `${chalk.green('✔')} ${chalk.bold(key)} removido com sucesso!`,
    );
    storage.persistSync();
    exit();
  });
};

exports.clear = function() {
  storage.clear(function() {
    process.stdout.write(chalk.green('✔ Todos os códigos foram apagadas'));
    storage.persistSync();
    exit();
  });
};

exports.list = function() {
  const packages = storage.keys();
  if (packages.length === 0) {
    process.stderr.write(
      `${chalk.red('✖')} Você não tem nenhum código cadastrado`,
    );
    exit();
  }

  packages.forEach(function(pack) {
    process.stdout.write(
      `\n ${chalk.bold('⇢ ', pack)}: ${storage.getItemSync(pack)}`,
    );
  });
};
