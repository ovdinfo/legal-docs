let b = require('substance-bundler')
let path = require('path')

function _buildLib(transpileToES5, cleanup) {
  b.js('./lib/substance-forms.js', {
    target: {
      useStrict: !transpileToES5,
      dest: './dist/substance-forms.js',
      format: 'umd', moduleName: 'forms', sourceMapRoot: __dirname, sourceMapPrefix: 'forms'
    },
    // NOTE: do not include XNode (id must be the same as used by DefaultDOMElement)
    ignore: ['./XNode'],
    buble: Boolean(transpileToES5),
    cleanup: Boolean(cleanup)
  })
}

function _minifyLib() {
  b.minify('./dist/substance-forms.js', './dist/substance-forms.min.js')
}

b.task('assets', function() {
  b.copy('node_modules/font-awesome', './dist/lib/font-awesome')
  b.copy('./vendor/substance.min.js', './dist/lib/substance.min.js')
  b.copy('./vendor/substance-forms.min.js', './dist/lib/substance-forms.min.js')
  b.css('./vendor/substance-reset.css', './dist/lib/substance-reset.css')
  b.css('./vendor/substance-forms.css', './dist/lib/substance-forms.css', { variables: true })
})

b.task('clean', function() {
  b.rm('./dist');
})

b.task('docs', function() {
  b.copy('./docs/*', './dist', {root: './docs'})
})

b.task('lib', function() {
  _buildLib('transpile', 'clean')
  _minifyLib()
})

b.task('dev:lib', function() {
  _buildLib()
})

b.task('default', ['clean', 'assets', 'docs'])
b.task('dev', ['clean', 'assets', 'docs', 'dev:lib'])

b.setServerPort(5555)
b.serve({
  static: true, route: '/', folder: 'dist'
})
