module.exports = function (grunt) {
  'use strict';

  var _ = grunt.util._;
  var path = require('path');
  var cp = require('child_process');

  function getChromeExe() {
    var prefixes = [
      process.env.LOCALAPPDATA,
      process.env.PROGRAMFILES,
      process.env['PROGRAMFILES(X86)']
    ];
    var suffix = '\\Google\\Chrome\\Application\\chrome.exe';
    var index = prefixes.length;
    var prefix;

    while (index--) {
      prefix = prefixes[index];
      if (grunt.file.exists(prefix + suffix)) {
        return path.resolve(prefix + suffix);
      }
    }
    return;
  }

  function move(src, dest) {
    src = path.resolve(src);
    dest = path.resolve(dest);

    if (src === dest) {
      return;
    }

    grunt.file.copy(src, dest);
    grunt.file.delete(src);
    grunt.log.ok('Created file: ' + dest);
  }

  function sourceFilter(dirPath) {
    if (!grunt.file.isDir(dirPath)) {
      grunt.log.warn('Source directory "' + dirPath + '" not found.');
      return false;
    }
    if (!grunt.file.exists(dirPath + '/manifest.json')) {
      grunt.log.warn('manifest file does not exist in the "' + dirPath + '".');
      return false;
    }
    return true;
  }

  function createArgs(dir, pem) {
    dir = path.resolve(dir);

    var args = [
      '--pack-extension=' + dir
    ];

    if (pem && grunt.file.exists(pem)) {
      args.push('--pack-extension-key=' + path.resolve(pem));
    }

    return args;
  }

  function createDefaultDest(dir) {
    dir = path.resolve(dir);
    return {
      base: dir,
      crx: dir + '.crx',
      pem: dir + '.pem'
    };
  }

  grunt.registerMultiTask('crx', 'Creating a package', function () {
    var options = this.options();
    grunt.verbose.writeflags(options, 'Options');

    var chromeBrowser = getChromeExe();
    grunt.verbose.writeln('ChromePath: ', chromeBrowser);

    if (this.files.length < 1) {
      grunt.verbose.warn('File Object not found.');
    }

    grunt.verbose.writeln();

    var done = this.async();
    grunt.util.async.forEachSeries(this.files, function(fileObj, nextFileObj) {
      var dirs = fileObj.src.filter(sourceFilter);

      if (!dirs.length) {
        grunt.log.warn('Valid source directory not found.');
        return nextFileObj();
      }

      grunt.verbose.writeln();

      var unitOption = _.extend({}, options);
      _.defaults(unitOption, {pem: fileObj.dest.replace(/\.crx$/, '.pem')});
      grunt.verbose.writeflags(unitOption, 'Unit Option');

      var defaultDest = createDefaultDest(dirs[0]);
      grunt.verbose.writeflags(defaultDest, 'Default dest');

      var args = createArgs(dirs[0], unitOption.pem);
      grunt.verbose.writeflags(args, 'Args');
      if (args.length === 2) {
        grunt.log.writeln('use Private key file: ' + unitOption.pem);
      }

      grunt.log.write('run command line of chrome.exe...');
      cp.execFile(chromeBrowser, args, {}, function (err) {
        if (err) {
          grunt.log.error();
          grunt.log.warn(err.message + err.code);
          nextFileObj();
          return;
        }
        grunt.log.ok();

        move(defaultDest.crx, fileObj.dest);

        if (grunt.file.exists(defaultDest.pem)) {
          move(defaultDest.pem, unitOption.pem);
        }

        grunt.log.writeln();
        nextFileObj();
      });
    }, done);
  });
};
