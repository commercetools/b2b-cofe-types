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
