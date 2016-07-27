export default function ({types: t}) {
  return {
    pre() {
      this.requires = [];
    },
    visitor: {
      CallExpression(path, { opts = {} }) {
        const callee = path.node.callee;
        const args = path.node.arguments;

        const {
          requireName = 'require',
          mappedRequireName = '$__require',
          map
        } = opts;

        // found a require
        if (t.isIdentifier(callee, { name: requireName }) &&
          args.length &&
          args.length == 1) {

          // require('x');
          if (t.isStringLiteral(args[0])) {

            let requiredModuleName = args[0].value;

            // mirror behaviour at https://github.com/systemjs/systemjs/blob/0.19.8/lib/cjs.js#L50 to remove trailing slash
            if (requiredModuleName[requiredModuleName.length - 1] == '/') {
              requiredModuleName = requiredModuleName.substr(0, requiredModuleName.length - 1);
            }

            if (opts.map && typeof opts.map === 'function') {
              requiredModuleName = opts.map(requiredModuleName) || requiredModuleName;
            }

            this.requires.push(requiredModuleName);

            path.replaceWith(
              t.callExpression(
                t.identifier(mappedRequireName),
                [t.stringLiteral(requiredModuleName)]
              )
            );
          }
          // require(expr)';
          else {
            path.replaceWith(
              t.callExpression(
                t.identifier(mappedRequireName),
                args
              )
            );
          }
        }
      },
      Identifier(path, { opts = {} }) {
        let {
          requireName = 'require',
          mappedRequireName = '$__require'
        } = opts;

        if (path.node.name === requireName) {
          path.node.name = mappedRequireName;
        }
      }
    }
  };
}
