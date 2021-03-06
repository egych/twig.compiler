//  Twig.compiler.helpers.js
//  Copyright (c) 2015 Egor Sharapov
//  Available under the MIT License
//  https://github.com/egych/twig.compiler.js
(function (Twig) {
  Twig.extend(function (Twig) {
    if (!Twig.compiler) {
      throw new Twig.Error("Twig.compiler not found.");
    }

    Twig.compiler.js = {
      vars: {
        twig: '_twig',
        context: 'ctx',
        output: 'o',
        for_loop: '_for_loop',
        for_else: '_for_else_',
        index_of_fn: '_index_of'
      },

      helpers: {}
    };

    Twig.compiler.js.helpers.regex = {
      space_between_tags: />\s+</g,
      new_lines_between_tags: />[\\n\s|\\r\s]{1,}</g,
      slashes: /\\/g,
      new_lines: /\n|\r/g,
      quotes: /(\"|\')/g
    };

    // Escape raw value
    Twig.compiler.js.helpers.escapeQuotes = function (str) {
      return (str||'')
        .toString()
        .replace(Twig.compiler.js.helpers.regex.slashes, '\\\\')
        .replace(Twig.compiler.js.helpers.regex.new_lines, '\\n')
        .replace(Twig.compiler.js.helpers.regex.quotes, '\\$1');
    };

    // Get value from context
    Twig.compiler.js.helpers.resolveValue = function (value) {
      var ctx_val = Twig.compiler.js.vars.context + '["' + Twig.compiler.js.helpers.escapeQuotes(value) + '"]';
      return '(typeof ' + ctx_val + ' == "function" ? ' + ctx_val + '() : ' + ctx_val + ')';
    };

    Twig.compiler.js.helpers.isInt = function (n) {
      return Number(n)===n && n%1===0;
    };

    Twig.compiler.js.helpers.hashCode = function (s) {
      return (s.split("").reduce(function(a, b){
        a = ((a<<5)-a)+b.charCodeAt(0);
        return a & a;
      }, 0)||"").toString().replace(/[^\d]/g, '');
    };

    Twig.compiler.js.helpers.parseValue = function (value) {
      var is_json;

      try {
        is_json = JSON.parse(value);

        switch (is_json) {
          case 'true': is_json = true; break;
          case 'false': is_json = false; break;
        }
      } catch (e) {}

      if (is_json !== undefined) {
        if ((typeof is_json === 'boolean') || (typeof is_json === 'number')) {
          return is_json;
        }
      }

      return value;
    }
  });
}(Twig || {}));
