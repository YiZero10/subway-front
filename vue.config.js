//vue.config.js 放在根目录下 不是src下
module.exports = {
    runtimeCompiler: true,
    publicPath: '/', // 设置打包文件相对路径
    devServer: {
        // open: process.platform === 'darwin',
        host: '127.0.0.1',
        port: 5000,
        // open: true, //配置自动启动浏览器
        proxy: {
            '/api': {
                target: 'http://localhost:8080/', // 对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
