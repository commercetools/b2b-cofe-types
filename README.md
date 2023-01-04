# B2B demo
This repo works with [Types](https://github.com/commercetools/b2b-cofe-types) and [Extensions](https://github.com/commercetools/b2b-cofe-extensions) repos as subtrees

## First time cloning this repo
1. Clone this repo
    ```
    git clone git@github.com:frontastic-developers/customer-b2bdemo.git
    ```
1. Add remotes
    ```
    git remote add extensions git@github.com:commercetools/b2b-cofe-extensions.git
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
1. Fetch code from Extensions into subtree
    ```
    git subtree add --prefix packages/demo/extensions extensions master --squash
    ```
1. Fetch code from Types into subtree
    ```
    git subtree add --prefix packages/demo/types types master --squash
    ```
1. Run the project
    ```
    frontastic init
    frontastic install
    frontastic run
    ```
### Update your code
1. Commit and push the changes to the `origin`, like a normal commit

## Extend or change behavior of code in `extensions` or `types`
Imagine you want to re-write/change some code in `extensions` or `types`. There are 3 options to choose from:
### You know your new code can be used by others using the repos
1. Commit and push the changes to the `origin`, like a normal commit
1. Commit the changes to `extensions`. Git subtree can detect any changes in `package/demo/extensions` and push changes to the other repo
    ```
    git subtree push --prefix packages/demo/extensions extensions <new-branch-name>
    ```
    Create a Pull Request from the <new-branch-name> to master in git@github.com:commercetools/b2b-cofe-extensions.git
1. Commit the changes to `types`. Git subtree can detect any changes in `package/demo/types` and push changes to the other repo
    ```
    git subtree push --prefix packages/demo/types types <new-branch-name>
    ```
    Create a Pull Request from the <new-branch-name> to master in git@github.com:commercetools/b2b-cofe-types.git

## Your new code is for your own usecase AND you still want to receive updates from other repos
1. Create `packages/<name>/backend/commerce/index.ts` and create/override new extensions as needed.

    Here `updateLineItem` endpoint in the cart controller is overwritten

    ```ts
    packages/<name>/backend/commerce/index.ts

    export default {
        'actions': {
            cart: {
                updateLineItem: () => {
                    /// new code
                }
            }
        }
    } as ExtensionRegistry
    ```
1. Merge with other extensions
    `packages/<name>/backend/index.ts`
    ```ts
    ...
    import CommerceExtensions from './commerce';
    ...
    const extensionsToMerge = [commercetoolsExtension, adyenExtension, contentfulExtensions, CommerceExtensions] as Array<ExtensionRegistry>;
    ```
1. You can pull changes from extensions repo at any time without modifying your changes.
    ```
    git subtree pull --prefix packages/demo/extensions extensions master --squash
    git subtree pull --prefix packages/demo/types types master --squash

    ```

## Your new code is for your own usecase and you don't want any updates from other repos

If you're not planning to get updates from `extensions` or `types` repos or push updates there (two optional sections above), you can go ahead and directly change code in those directories. You just have to remember never use  `git subtree push` or `git subtree pull` commands.


### variables to set
1. project.yml`
```
smtp:
    ...
preBuy:
    storeCustomType: lulu-store // name of the custom type on the store
    orderCustomType: lulu-order // name of the custom type on the cart/order
    storeCustomField: is-pre-buy-store // name of the field in the custome type. boolean field
    orderCustomField: is-created-from-pre-buy-store // boolean field in the custom type
wishlistSharing:
    wishlistSharingCustomType: b2b-list
    wishlistSharingCustomField: business-unit-keys // string(set)
```
