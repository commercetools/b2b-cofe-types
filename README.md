# B2B Types
This repo serves as one central repo to manage types

## How to use
1. Add as a dependency
    ```
    cd <to-desired-directory>
    yarn add https://github.com/commercetools/b2b-demo-types.git
    ```
1. Set `tsconfig.json`
    ```
    ...
    "paths": {
      "@Types/*": ["node_modules/@b2bdemo/types/build/*"],
    },
    ...
        "typeRoots": [
            ...,
            "./node_modules/@b2bdemo/types/build"
        ],
    ...

    ```
    you can use any other alias instead of `@Types`
1. Set Alias in Webpack (Optional)
    ```
    export default {
        ...
        resolve: {
            ...
            alias: {
                ...
                        '@Types': path.resolve(__dirname, 'node_modules/@b2bdemo/types/build/'),

            }
        }
    }
    ```
    you can use any other alias instead of `@Types`
