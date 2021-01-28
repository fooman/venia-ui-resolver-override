const name = 'fooman/venia-ui-override-resolver';
const VeniaUiResolverPlugin = require('./lib/VeniaUiResolverPlugin');
const path = require('path');
const {cachedCleverMerge} = require('webpack/lib/util/cleverMerge');

const customStoreDir = path.resolve(__dirname, '..', '..', '..', 'src', 'overrides', 'venia-ui');
const customLibDir = path.resolve(__dirname, '..', '..', '..', 'src', 'overrides', 'peregrine');
const customPagebuilderDir = path.resolve(__dirname, '..', '..', '..', 'src', 'overrides', 'pagebuilder');

const veniaUiModulePath = path.resolve(__dirname, '..', '..', '..', 'node_modules', '@magento', 'venia-ui', 'lib');
const peregrineModulePath = path.resolve(__dirname, '..', '..', '..', 'node_modules', '@magento', 'peregrine', 'lib');
const pagebuilderModulePath = path.resolve(__dirname, '..', '..', '..', 'node_modules', '@magento', 'pagebuilder', 'lib');

const myResolverPlugin = new VeniaUiResolverPlugin({
    name: name,
    projectPath: customStoreDir,
    veniaUiModulePath: veniaUiModulePath
});

const myPeregrineResolverPlugin = new VeniaUiResolverPlugin({
    name: 'fooman/peregrine-override-resolver',
    projectPath: customLibDir,
    veniaUiModulePath: peregrineModulePath
});

const myPagebuilderResolverPlugin = new VeniaUiResolverPlugin({
    name: 'fooman/pagebuilder-override-resolver',
    projectPath: customPagebuilderDir,
    veniaUiModulePath: pagebuilderModulePath
});

module.exports = targets => {
    const webpackCompiler = targets.of('@magento/pwa-buildpack').webpackCompiler;
    webpackCompiler.tap(compiler =>
        compiler.resolverFactory.hooks.resolveOptions
            .for('normal')
            .tap('AddVeniaResolverToWebpackConfig', resolveOptions => {
                const plugin = Object.assign(
                    {
                        plugins: [myResolverPlugin, myPeregrineResolverPlugin, myPagebuilderResolverPlugin]
                    });
                return cachedCleverMerge(plugin, resolveOptions);
            })
    );
    webpackCompiler.tap(compiler =>
        compiler.resolverFactory.hooks.resolveOptions
            .for('context')
            .tap('AddVeniaResolverToWebpackConfig', resolveOptions => {
                const plugin = Object.assign(
                    {
                        plugins: [myResolverPlugin, myPeregrineResolverPlugin, myPagebuilderResolverPlugin]
                    });
                return cachedCleverMerge(plugin, resolveOptions);
            })
    );
};
