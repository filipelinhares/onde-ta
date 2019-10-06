const Conf = require('conf');
const chalk = require('chalk');

const conf = new Conf()

exports.save = (key, value) => {
  conf.set(key, value)
  console.log(
    `${chalk.green('✔')} Salvo ${chalk.bold(value)} como ${chalk.bold(key)}`,
  );
};

exports.get = (key) => {
  if (conf.has(key)) {
    return conf.get(key);
  }

  console.log(
    `${chalk.red('✖')} ${chalk.bold(key)} não existe, use ${chalk.bold(
      'onde-ta --save SEU_CÓDIGO',
      key,
    )} para criar`,
  );
};

exports.del = (key) => {
  conf.delete(key);
  console.log(
    `${chalk.green('✔')} ${chalk.bold(key)} removido com sucesso!`,
  );
};

exports.clear = () => {
  conf.clear();
  console.log(chalk.green('✔ Todos os códigos foram apagadas'));
};

exports.list = () => {
  const storeKeys = Object.keys(conf.store);
  if (storeKeys.length === 0) {
    console.log(
      `${chalk.red('✖')} Você não tem nenhum código cadastrado`,
    );
  }

  console.log(`Seus códigos: \n`)
  storeKeys.forEach((key) => {
    console.log(
      `${chalk.bold('•', key)}: ${conf.get(key)}`,
    );
  });
};
