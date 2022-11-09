- [ReadMe](../ReadMe.md)
- [Wiki Index](./WikiIndex.md)

# Javascript Target And Module Resolution

The Javascript target is ECMAScript 2021 (es2021 tsc target option).

The module resolution to load this package is ECMAScript which is now the standard.  A helpful package,
[@franzzemen/rulesEngine-commonjs-examples](https://www.npmjs.com/package/@franzzemen/re-commonjs-examples), has been
provided in npm and github on how to integrate into a CommonJS loaded project.

Alternatives for target Javascript:

- Clone the desired packages and rulesEngine-transpile to desired target, change appropriate values in tsconfig.src.json. To
  better understand the build process, see the Contributor's Documentation. Realistically, you will need to rebuild all
  dependencies and may have issues with at least some third party libraries, which you'll need to back version.
- If you desire to obtain a published version to a past target place the request in the package's Github issues. If
  there is sufficient demand, we may consider how to provide a package that contains several target javascript versions.

CommonJS alternative to ES module loading:

- Clone, same answer as above.
- A potentially much easier option is to use dynamic import from your commonjs code as explained here:

For Typescript type checking, import types in local files, for example:

    type RulesEngine = import('@franzzemen/es').RulesEngine.

This will not be transpiled to generated javascript code; it will however provide you with type checking, and you don't
have to account for the asynchronicity (promise) associated with import() for types.

For actual working code, to incorporate promises for example:

    // Regular require declarations
    const _ = require('lodash');
    // ES Type imports
    type RulesEngine = import('@franzzemen/es').RulesEngine;
    // Dynamic imports
    import('@franzzemen/rulesEngine')
      .then(rulesEngine => {
        const RulesEngine = rulesEngine.RulesEngine;
        RulesEngine.Engine.load(...);
      });

A working example is provided
in [@franzzemen/rulesEngine-commonjs-examples](https://www.npmjs.com/package/@franzzemen/re-commonjs-examples). You can install
and run, or clone from github and use the scaffolding as a starting point.
