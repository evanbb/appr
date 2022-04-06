// you should be allowed to import types
const shouldPass = [
  `import type foo from 'this/domain'`,
  `import type foo from 'this/application'`,
  `import type foo from 'this/infrastructure'`,
  `import { type foo } from 'this/domain'`,
  `import { type foo } from 'this/application'`,
  `import { type foo } from 'this/infrastructure'`,
];
// you should NOT be allowed to import values or modules
const shouldFail = [
  `import foo from 'this/domain'`,
  `import foo from 'this/application'`,
  `import foo from 'this/infrastructure'`,
  `import { foo } from 'this/domain'`,
  `import { foo } from 'this/application'`,
  `import { foo } from 'this/infrastructure'`,
  `import 'this/infrastructure'`,
  `import('this/infrastructure')`,
  `import('this/`,
];

export default {
  create: (context) => {
    return {
      ArrayExpression(node) {},
    };
  },
};

/**
 * node
 *
 * observability - terry's concerns - bubble up to sutha and mohan?
 *
 *
 */
