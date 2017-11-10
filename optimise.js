const SVGO = require('svgo');
const { loopWhile } = require('deasync');
const deepmerge = require('deepmerge');

const mergeSVGOPlugins = arr =>
  arr.reduce((acc, curr, i, arr) => {
    const key = Object.keys(curr)[0];
    acc[key] = curr[key];

    if (i === arr.length - 1) {
      return Object.keys(acc).reduce((final, key) => {
        final.push({ [key]: acc[key] });
        return final;
      }, []);
    }

    return acc;
  }, {});

module.exports = function optimise(
  name,
  content,
  { plugins = [], ...opts } = {}
) {
  const contentWithIDs = content.replace(
    / +id=\"([0-9a-zA-Z_-]+)"/gi,
    ` id="${name}-$1"`
  );

  const DEFAULT_PLUGINS = [
    {
      cleanupIDs: false,
    },
  ];
  const config = {
    ...opts,
    plugins: mergeSVGOPlugins([...DEFAULT_PLUGINS, ...plugins]),
  };

  let done = false;
  let returnValue = null;
  let error = null;

  const svgo = new SVGO(config);

  svgo.optimize(contentWithIDs).then(
    ({ data }) => {
      returnValue = data;
      done = true;
    },
    err => {
      error = err;
      done = true;
    }
  );

  // Babel wants a sync function, but SVGO.optimize is an async function
  loopWhile(() => !done);

  if (error) {
    throw error;
  }

  return returnValue;
};
