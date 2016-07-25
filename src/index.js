export default function ({types: t}) {
  return {
    visitor: {
      CallExpression(path, { opts = {} }) {
        const callee = path.node.callee;
        const args = path.node.arguments;

        const {
          requireName = 'require',
          mappedRequireName = '$__require',
          map
        } = opts;

        // found an eval potentially containing a require
        if (t.isIdentifier(callee, { name: 'eval' }) &&
          args.length === 1) {

          let evalArgument = path.get('arguments')[0];
          let evaluate = evalArgument.evaluate();

          if (!evaluate.confident) {
            return;
          }

          let code = evaluate.value;
          if (typeof code !== 'string') {
            return;
          }

          code = code.replace(requireName, mappedRequireName);
          code = t.stringLiteral(code);

          evalArgument.replaceWith(code);
        }

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

            if (map && typeof map === 'function') {
              requiredModuleName = map(requiredModuleName);
            }

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
