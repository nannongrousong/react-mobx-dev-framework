module.exports = {
    'parser': '@typescript-eslint/parser',
    'env': {
        'browser': true,
        'es6': true,
        'node': true,
    },
    'extends': ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'plugins': [
        'react', '@typescript-eslint'
    ],
    'globals': {
        'NODE_ENV': process.env.NODE_ENV
    },
    'rules': {
        'indent': 0,
        'linebreak-style': 0,
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-console': 'off',
        'react/display-name': [0],
        'no-unused-vars': [1],
        'no-debugger': [1],
        'no-class-assign': [0],
        //  格式化，空格 tab
        '@typescript-eslint/indent': [0],
        //  类成员属性修饰符
        '@typescript-eslint/explicit-member-accessibility': [0],
        //  允许使用any 逐步替换any
        '@typescript-eslint/no-explicit-any': [0],
        //  函数返回值
        '@typescript-eslint/explicit-function-return-type': [0]
    }
};