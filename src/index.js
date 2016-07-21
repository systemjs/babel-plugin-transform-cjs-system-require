export default function ({ types: t }) {
 return {
    visitor: {
      CallExpression: function CallExpression(path, state) {
        var opts = state.opts === undefined ? {} : state.opts;

        var callee = path.node.callee;
        var args = path.node.arguments;
      
		// found an eval potentially containing a require
        if (t.isIdentifier(callee, { name: 'eval' }) && args.length === 1) {
            let evaluate = path.get('arguments')[0].evaluate();

            if (!evaluate.confident) {
              return;
            }

            let code = evaluate.value;
            if (typeof code !== 'string') {
              return;
            }
			
			code = code.replace(opts.requireName, opts.mappedRequireName);

            path.get('arguments')[0].replaceWith(t.stringLiteral(code));
        }
		
        // found a require
        if (t.isIdentifier(callee, { name: opts.requireName}) && args.length && args.length == 1) {
          
          // require('x');
          if (t.isStringLiteral(args[0])) {
			
            var requireModule = args[0].value;

            // mirror behaviour at https://github.com/systemjs/systemjs/blob/0.19.8/lib/cjs.js#L50 to remove trailing slash
            if (requireModule[requireModule.length - 1] == '/') {
              requireModule = requireModule.substr(0, requireModule.length - 1);
            }

            var requireModuleMapped = opts.map && opts.map(requireModule) || requireModule;
			
            path.replaceWith(
              t.callExpression(
                t.identifier(opts.mappedRequireName),
                [t.stringLiteral(requireModuleMapped)]
              )
            );
          } 
		  // require(expr)';
		  else {
            path.replaceWith(
              t.callExpression(
                t.identifier(opts.mappedRequireName),
                [...args]
              )
            );
          }
        }
      },
      Identifier: function Identifier(path, state) {
        var opts = state.opts === undefined ? {} : state.opts;

         if(path.node.name === opts.requireName) {
           path.node.name = opts.mappedRequireName;
         }
      }
    }
  };
}
