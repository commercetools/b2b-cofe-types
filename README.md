# B2B Types
This repo serves as a central place for CoFe extensions. This repo is coupled with [Extensions](https://github.com/commercetools/b2b-cofe-extensions) repo.

**This README file is only reflecting the changes you have to apply for types.** To see all the required modifications, please see [Extensions](https://github.com/commercetools/b2b-cofe-extensions)

## How To Use
In order to use this package in your FE/BE app in a way that you can have the latest changes, you can use `git subtree` command.
You can read a bit more about `git subtree` in [here](https://www.atlassian.com/git/tutorials/git-subtree) or [here](https://gist.github.com/SKempin/b7857a6ff6bddb05717cc17a44091202)

### Adding B2B types to a new CoFe project
#### Prerequisites
1. You have a working CoFe env and access to git repo
1. Little or no modification is done in `packages/<name>/backend/commerce-commercetools`. All changes you have done under this dir will be removed unless you cherry-pick them after the process.

#### Steps
1. Remove `commerce-commercetools/` dir from `packages/<name>/backend`
1. Remove `types/` dir from `packages/<name>/`
1. Commit changes
    ```
    git add . && git commit -m"remove built-in extensions and types" 
    ```
1. Add `extensions` remote to your project
    ```
    git remote add extensions git@github.com:commercetools/b2b-cofe-extensions.git
    ```
1. Add `types` remote to your project
    ```
    git remote add types git@github.com:commercetools/b2b-cofe-types.git
    ```
1. Check if everything is in place
    ```sh
    git remote -v 
    ```
    Should respond like 
    ```sh
    extensions      git@github.com:commercetools/b2b-cofe-extensions.git (fetch)
    extensions      git@github.com:commercetools/b2b-cofe-extensions.git (push)
    origin  git@github.com:frontastic-developers/<your-repo-origin> (fetch)
    origin  git@github.com:frontastic-developers/<your-repo-origin> (push)
    types   git@github.com:commercetools/b2b-cofe-types.git (fetch)
    types   git@github.com:commercetools/b2b-cofe-types.git (push)
    ```
1. Fetch code from this repo into subtree
    ```
    git subtree add --prefix packages/<name>/extensions extensions master --squash
    ```
1. Fetch code from Types repo into subtree
    ```
    git subtree add --prefix packages/<name>/types types master --squash
    ```

1. Modify `packages/<name>/backend/webpack/webpack.common.js` to use `types` and `extensions` repo
    ```js
    export default {
        ...
        resolve: {
            extensions: ['.json', '.ts', '.js', '.ts'],
            alias: {
                '@Types': path.resolve(__dirname, '../../types/types/'),
                '@Extensions': path.resolve(__dirname, '../../extensions/'),
            }
        },
    }
    ```
1. Modify `packages/<name>/backend/tsconfig.json` to use `types` and `extensions` repo
    ```json
    {
        "compilerOptions": {
            ...
            "paths": {
                "@Types/*": ["../types/types/*"],
                "@Extensions/*" : ["../extensions/*"],
            },
            "typeRoots": [
                ...
                "../types/types"
            ],
        }
    }

    ```
1. Modify `packages/<name>/frontend/tsconfig.json` to use `types` and `extensions` repo
    ```json
    {
        "compilerOptions": {
            ...
            "paths": {
                "@Types/*": ["../types/types/*"],
            },
        }
    }

    ```
1. Modify `packages/<name>/frontend/package.json`
    ```json
    {
        ...
        "scripts": {
            "postinstall": "cd ../types && yarn install && cd ../extensions && yarn install",
            ...
        }
    }

    ```
3. Add changes to repo
    ```
    git commit -m"<commit message>" && git push
    ```
1. `frontastic install`    

### Clone a project already using this repo
1. Clone the repo
    ```
    git clone <url>
    ```
1. Add remotes
    ```
    git remote add extensions git@github.com:commercetools/b2b-cofe-extensions.git
    git remote add types git@github.com:commercetools/b2b-cofe-types.git
    ```
1. Add changes (Optional)
    ```
    git commit -m"<commit message>" && git push
    ```

### Update types from a clone of this repo
Use `git commit` and `git push` 

### Update types from a project using this repo as a subtree
1. Commit the changes to the `origin` of your repo
1. If you have never pulled from `estensions` or `types` repos, you should pull first
    ```
    git subtree pull --prefix packages/<name>/extensions extensions master --squash
    git subtree pull --prefix packages/<name>/types types master --squash
    ```
1. Commit the changes to `types` (git automatically pick the changes on `packages/<name>/types` and push them to this repo)
    ```
    git subtree push --prefix packages/<name>/types types <new-branch-name>
    ```
    Create a Pull Request from the <new-branch-name> to master in git@github.com:commercetools/b2b-cofe-types.git

## Extending CoFe without updating `types` repo
1. Create `packages/<name>/commerce-types` dir and extend types from this repo
