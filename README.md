# Onde ta? ![Build Status](https://travis-ci.org/filipelinhares/onde-ta.svg?branch=master)
> Rastreie suas encomendas.

<p align="center">
	<img src="images/screen.png" alt="Screenshot">
</p>

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
    $ onde-ta --save

  Opções
    --save     Salva um código de rastreio com nome
    --remove   Remove o código selecionado
    --clear    Remove todos os códigos salvos
    --list     Listar todos os códigos salvos com um nome
```

## Todo
- [x] Add local storage to save codes by keywords

## License
[MIT](LICENSE.md) © Filipe LInhares
