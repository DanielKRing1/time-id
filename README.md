# TsTemplate
A template for building TS code with Jest + git + npm publish

# Includes
### 1. Npm + Git
1.1. .gitignore /node_modules + /dist
1.2. .npmignore /node_modules + /src

### 2. Compiled TS entry points
2.1. Entry points defined in package.json

### 3. TS Build scripts
3.1. Build + publish scripts -> will publish to git remote and npm
3.3. "tsconfig.json" for dev and "tsconfig-build" for compile
3.2. "npm-run-all" dev dependency

### 4. Jest setup + Dummy test
4.1. "jest.config.js" for testing TS code
4.2. "jest" + "@types/jest" + "ts-jest" + "typescript" dev dependencies
4.3. Dummy test defined
