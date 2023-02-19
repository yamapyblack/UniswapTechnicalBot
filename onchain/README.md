# UniswapTechnicalBot/onchain

## Install

### direnv

Recommend **direnv**

Mac OS

```
brew install direnv
```

Other OS

```
git clone https://github.com/direnv/direnv
cd direnv
sudo make install
```

Copy to **.envrc** and setup

```
cp .envrc.sample .envrc
direnv allow
```

Passed path to node_modules, you don't need to use "npx"

### npm

To run hardhat script

```
npm install
```

### foundry

To install Foundry for Testing (assuming a Linux or macOS system)

```
curl -L https://foundry.paradigm.xyz | bash
```

This will download foundryup. To start Foundry, run

```
foundryup
```

To install dependencies

```
forge install
```

## Usage

Testing

```
forge test -vv --fork-url ${ARB_URL} --fork-block-number ${ARB_BLOCK}
```
