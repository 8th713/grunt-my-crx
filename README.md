# grunt-my-crx v0.0.1
> Package a Chrome extensions.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install git://github.com/8th713/grunt-my-crx.git --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-my-crx');
```

## Package task
_Run this task with the `grunt crx` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### pem
Type: `String`

このオプションは、`.pem` ファイルの場所を指定します。
ファイルが指定された場所に存在しない場合は、拡張は `.pem` ファイルなしで作成されます。
その後、この場所に`.pem` ファイルが作成されます。

###Examples
```shell
.
├── Gruntfile.js
└── src
    ├── ext
    │   └── manifest.json
    └── ignored
```

```js
crx: {
  release: {
    options: {
      pem: 'private/my_ext.pem'
    },
    files: {
      'dist/my_ext_<%= manifest.version %>.crx': ['src/ignored', 'src/ext']
    }
  }
}
```

`src` プロパティには manifest.json を含むディレクトリを指定します。
配列で指定された場合、manifest.json が含まれている最初のディレクトリが使用されます。

初回実行時、`private/my_ext.pem` は存在しないので鍵を指定せずにパッケージングします。
初回実行時に鍵ファイルは自動的に生成されます。

```shell
.
├── Gruntfile.js
├── dist
│   └── my_ext_1.0.0.crx
├── private
│   └── my_ext.pem
└── src
    ├── ext
    │   └── manifest.json
    └── ignored
```

二回目以降は初回に作成された `private/my_ext.pem` を使用してパッケージングします。
