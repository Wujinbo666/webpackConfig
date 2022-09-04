const path = require('path')
//打包js成指定名称js并将js引入到项目中
const HtmlWebpackPlugin  = require('html-webpack-plugin')

// 压缩css, 该插件在Optimization(优化里面配置)
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// 支持将css抽离成单个文件，通过link放视引入组件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const toml = require('toml')
const yaml = require('yaml')
const json5 = require('json5')

module.exports = {
  // 入口
   // 手动配置打包多入口
   entry: {
    index: './src/index.js',
    another: './src/another-module.js'
  },
  // 出口
  output: {
    // filename: 'bundle.js',
    // 手动配置打包多入口，filename名字不能写死，应该如下
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
    clean: true, //每次打包清理原文件
    assetModuleFilename: 'images/[contenthash][ext]'//指定生成资源的路径及文件名 (优先级弱于generator)
    //contenthash 根据文件的内容生成hash字符串
  },
  mode: 'development',
  // 安装HtmlWebpackPlugin
  // inline-source-map 浏览器错误的提示对应ide中的行数
  devtool: 'inline-source-map',
  plugins:[
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'app.html',
      inject: 'body'
    }),
    new MiniCssExtractPlugin({
      //指定打包css的路径文件名
      filename: 'styles/[contenthash].css'
    })
  ],
  // 安装webpack-dev-server 服务启动后， 结果是储存在内存中的，不受dist影响
  devServer: {
    //给webpack 服务配置入口
    static: './dist' 
   
  },
  module: {
    rules: [
      {
        test: /\.png$/,// 用于匹配文件类型
        type: 'asset/resource',//生成一个单独的文件，并成图片的uri
        //指定生成资源的路径及文件名 同上 output(generator里面的优先级，会高于output里面的优先级)
        generator: {
          filename: 'images/[contenthash][ext]'
        }
      }, {
        test: /\.svg$/,
        type: 'asset/inline'//data-uri打包成base64的格式
      },
      {
        test: /\.txt$/,
        type: 'asset/source'//导出资源的源代码
      },{
        test: /\.jpg$/,
        type: 'asset', //通用型资源类型 会在 asset/resource和asset/inline中选择 (默认文件资源大于8k选择asset/inline,否则选择asset/source),]， 可以通过 dataUrlCondition修改默认设置
        parser: {
          dataUrlCondition: {
            //更改asset默认大于8k生产资源文件变成默认大于4m生产资源文件
            maxSize: 4 * 1024 *1024
          }
        }
      },
      {
        test: /\.(css|less)$/,
        // 数组中的loader加载从右往左， 这里先less-loader解析成css,然后css-loader识别解析css,然后style-loader将css插入到指定位置
        // use: ['style-loader', 'css-loader', 'less-loader']
        // 使用//mini-css-extract-plugin插件将css抽离出来, 通过link引入
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      }, {
        test: /\.(woff|woff2|eot|ttf|otf)/,
        type: 'asset/resource'
      }, {
        test: /\.(csv|tsv)$/,
        use:'csv-loader'
      },
      {
        test: /\.xml$/,
        use: 'xml-loader'
      }, {
        test: /\.toml$/,
        type: 'json',
        parser: {
          parse: toml.parse
        }
      }, {
        test: /\.yaml$/,
        type: 'json',
        parser: {
          parse: yaml.parse
        }
      }, {
        test: /\.json5$/,
        type: 'json',
        parser: {
          parse: json5.parse
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // 下面的use配置好后既可以加载本地的js又能加载node_modules里面的js但是，node——modules里面的js不需要loader编译，直接可以加载，所以需要排除解析
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin(),
    ],
  },
}

// 常用的代码分离方法
// 1、入口起点，使用entry配置手动地分离代码， 缺点如果不同的入口引入了相同的包，会造成重复打包
// 2、防止重复的方法， 使用 Entry dependencies 或者 SplitChunksPlugin去重和分离代码 
// 3、动态导入方法， 通过模块的内联函数调用来分离代码
