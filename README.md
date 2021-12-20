<h1 align="center">Ленинград под Огнём</h1>

<p align="center">Интерактивная историческая карта артиллерийских и авиа-ударов Ленинграда 
в период Великой Отечественной Войны.</p>

<p align="center">
    <a href="https://github.com/stepan-anokhin/spb-histmap/actions?query=workflow%3AFrontend%20CI"><img src="https://github.com/stepan-anokhin/spb-histmap/workflows/Frontend%20CI/badge.svg?branch=master" alt="CI Workflow"></a>
    <a href="LICENSE"><img src="https://img.shields.io/github/license/stepan-anokhin/spb-histmap.svg" alt="License"></a> 
</p>

## Разработка

### Сборка

Убедиться, что используется правильная версия `node.js`:

```shell
nvm use
```

Прогнать тесты:

```shell
npm run test
```

Собрать проект:

```shell
npm run build
```

Результаты сборки будут доступны в директории `./build`.

Запустить dev-сервер:

```shell
npm run dev
```

Локальный dev-сервер будет доступен по следующему по [http://localhost:9999/](http://localhost:9999/)
