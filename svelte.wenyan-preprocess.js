import wenyan_ from '@wenyan/core';
const { compile } = wenyan_

/** @type {(opts?: import('@wenyanlang/core').CompileOptions)=>import('svelte/compiler').PreprocessorGroup} */
export default function wenyanPre(opts = {}) {
  return {
    name: 'wenyan-script',

    async script({ content, attributes }) {
      if (attributes.lang !== '文言') return;

      // Wenyan to CJS
      const { code } = compile(content, opts);

      // Turn CommonJS export into ESM, so Svelte can use it 
      return {
        code: `
					const module = { exports: {} };
					${code}
					const __exp = module.exports ?? {};
					export default __exp;
					export const { ...named } = __exp;
				`,
        map: null,
        attributes: { lang: 'js' }
      };
    }
  };
}