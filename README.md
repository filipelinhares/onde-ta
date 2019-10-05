# onde-ta
> Rastreie suas encomendas

![Build Status](https://travis-ci.org/filipelinhares/onde-ta.svg?branch=master) ![npm version](https://img.shields.io/npm/v/onde-ta)

![Print screen of onde-ta output](https://i.imgur.com/NefmzbN.png)

## Install
```
$ npm install --global onde-ta
```

## Usage
```
$ onde-ta --help

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
```

## Service
- [Correios Tracking](https://github.com/filipelinhares/correios-tracking)

## License
[MIT](LICENSE.md) © Filipe Linhares
