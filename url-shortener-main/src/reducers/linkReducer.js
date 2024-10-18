name: ci

on: [push, pull_request]

jobs:
  legacy:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: ['0.10', '0.12', 4.x, 6.x, 8.x]

    steps:
      - uses: actions/checkout@v2

      - name: Use Node.js
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install
        run: |
          npm install --production && npm in