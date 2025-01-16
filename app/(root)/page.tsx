import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts } from '@/lib/actions/products.actions';
import { LATEST_PRODUCT_LIMIT } from '@/lib/constants';

export const metadata = {
  title: 'Home',
};
const Home = async () => {
  const latestProducts = await getLatestProducts();
  return (
    <ProductList
      data={latestProducts}
      title='New Arrivals'
      limit={LATEST_PRODUCT_LIMIT}
    />
  );
};

export default Home;
