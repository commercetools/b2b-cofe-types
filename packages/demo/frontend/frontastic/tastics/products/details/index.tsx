/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Product } from '@Types/product/Product';
import { Variant } from '@Types/product/Variant';
import ProductDetails, { UIProduct, UIColor, UISize } from 'components/commercetools-ui/products/product-details';
import { useCart, useProducts } from 'frontastic';

function ProductDetailsTastic({ data }) {
  const router = useRouter();
  const { getAttributeGroup } = useProducts();
  const { product }: { product: Product } = data.data.dataSource;

  const [currentVariantIdx, setCurrentVariantIdx] = useState<number>();
  const [variant, setVariant] = useState<Variant>(product.variants[0]);
  const [prod, setProd] = useState<UIProduct>();
  const [productFeaturesAttributes, setProductFeaturesAttributes] = useState<string[]>([]);
  const { addItem } = useCart();

  if (!product || !variant) return null;

  // 🙈
  // feel free to add a map if there are later
  // more colors missing (or add to tailwind conf)
  const grayFix = (word: string) => (word === 'grey' ? 'gray' : word);

  // just two main features for now, colors and sizes.
  // we pick a unique list from the payload to build the
  // selector
  // Upon selecting a feature, color or size, we find the
  // selected variant from the list based on the selected
  // features..
  const colors = [
    ...new Map(
      product.variants?.map((v: Variant) => [
        v.attributes.color?.label,
        {
          name: v.attributes.color?.label,
          key: v.attributes.color?.key,
          bgColor: `bg-${grayFix(v.attributes.color?.key)}-500`,
          selectedColor: `ring-${grayFix(v.attributes.color?.key)}-500`,
        },
      ]),
    ).values(),
  ].filter((item) => item.key) as UIColor[];

  const sizes = [
    ...new Map(
      product.variants?.map((v: Variant) => [v.attributes.commonSize?.label, v.attributes.commonSize]),
    ).values(),
  ].filter((item) => item) as UISize[];

  const tastes = [
    ...new Map(product.variants?.map((v: Variant) => [v.attributes.taste, v.attributes.taste])).values(),
  ].filter((item) => item);

  // this maps the entire payload to a component
  // friendly datastructure, so data and presentation
  // stay decoupled.
  // TODO: properly type

  useEffect(() => {
    if (typeof currentVariantIdx !== 'undefined') {
      const currentVariantSKU = prod.variants[currentVariantIdx].sku;
      const path = router.asPath.split('?')[0].split('/').slice(0, -1).join('/');

      router.replace(
        {
          pathname: `${path}/${currentVariantSKU}`,
          query: router.query,
        },
        undefined,
        {
          shallow: true,
        },
      );
      setVariant(product.variants[currentVariantIdx]);
    }
  }, [currentVariantIdx]);

  useEffect(() => {
    const currentProd: UIProduct = {
      name: product.name,
      // add variants as well, so we can select and filter
      variants: product.variants,
      categories: product.categories,
      price: variant.price,
      // rating: 4,
      images: variant.images?.map((img: string, id: number) => ({
        id: `${variant.sku}-${id}`,
        src: img,
        alt: variant.sku,
      })),
      colors,
      sizes,
      tastes,
      description: `
        <p>${product.description || ''}</p>
      `,

      //   details: [
      //     {
      //       name: 'Features',
      //       items: [
      //         variant.attributes.designer && `Designer: ${variant.attributes.designer.label}`,
      //         variant.attributes.gender && `Collection: ${variant.attributes.gender.label}`,
      //         variant.attributes.madeInItaly && `Made in Italy`,
      //       ],
      //     },
      //   ],
    };

    setProd(currentProd);
  }, [variant]);

  useEffect(() => {
    (async () => {
      setProductFeaturesAttributes(await getAttributeGroup('features'));
    })();
  }, []);

  const handleAddToCart = (variant: Variant, quantity: number): Promise<void> => {
    return addItem(variant, 1);
  };

  return (
    <ProductDetails
      product={prod}
      productFeaturesAttributes={productFeaturesAttributes}
      onAddToCart={handleAddToCart}
      variant={variant}
      onChangeVariantIdx={setCurrentVariantIdx}
    />
  );
}

export default ProductDetailsTastic;
