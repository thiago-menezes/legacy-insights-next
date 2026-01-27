import { existsSync } from 'fs';
import path from 'path';
import process from 'node:process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function postcssBoostModuleSpecificity(opts = {}) {
  const options = {
    boost: ':not(#_):not(#_)',
    ...opts,
  };

  return {
    postcssPlugin: 'postcss-boost-module-specificity',

    Rule(rule, { result }) {
      const inputFile = result.opts.from || '';

      if (!inputFile.includes('.module.')) {
        return;
      }

      if (inputFile.includes('node_modules')) {
        return;
      }

      const skipPatterns = ['::before', '::after', '::-webkit', '@'];
      if (skipPatterns.some((pattern) => rule.selector.includes(pattern))) {
        return;
      }

      if (rule.selector.includes(':not(#_)')) {
        return;
      }

      const selectors = rule.selector.split(',').map((s) => s.trim());

      const boostedSelectors = selectors.map((selector) => {
        return `${options.boost}${selector}`;
      });

      rule.selector = boostedSelectors.join(', ');
    },
  };
}

postcssBoostModuleSpecificity.postcss = true;

function findMonorepoRoot() {
  const cwd = process.cwd();

  const cwdReshaped = path.join(cwd, 'node_modules', 'reshaped');
  if (existsSync(cwdReshaped)) {
    return cwd;
  }

  let currentDir = __dirname;
  while (currentDir !== path.dirname(currentDir)) {
    const nodeModulesPath = path.join(currentDir, 'node_modules', 'reshaped');
    if (existsSync(nodeModulesPath)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  return cwd;
}

const monorepoRoot = findMonorepoRoot();
const themeMediaCSSPath = path.resolve(
  monorepoRoot,
  'node_modules/reshaped/dist/themes/reshaped/media.css',
);

const postcssConfig = {
  plugins: [
    ['@csstools/postcss-global-data', { files: [themeMediaCSSPath] }],
    'postcss-custom-media',
    postcssBoostModuleSpecificity(),
    ['cssnano', { preset: ['default', { calc: false }] }],
  ],
};

export default postcssConfig;
