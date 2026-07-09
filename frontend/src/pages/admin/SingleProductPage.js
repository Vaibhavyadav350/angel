import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  SidebarWithHeader,
  ImagesList,
  SingleProductInfo,
  SingleProductReviews,
} from '../../components/admin';
import { useAdminProductStore } from '../../stores';

function SingleProductPage() {
  const { id } = useParams();
  const {
    single_product_loading: loading,
    single_product_error: error,
    single_product: product,
    fetchSingleProduct,
  } = useAdminProductStore();

  useEffect(() => {
    fetchSingleProduct(id);
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <SidebarWithHeader>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-bronze/20 border-t-gold rounded-full animate-spin" />
        </div>
      </SidebarWithHeader>
    );
  }

  if (error) {
    return (
      <SidebarWithHeader>
        <div className="flex items-center justify-center py-20">
          <p className="text-lg font-editorial text-red-500">There was an error</p>
        </div>
      </SidebarWithHeader>
    );
  }

  const { images, reviews = [] } = product;
  return (
    <SidebarWithHeader>
      <div className="flex flex-col lg:flex-row gap-8 items-start bg-white border border-bronze/10 rounded-lg p-8 mb-4 overflow-x-auto">
        <ImagesList images={images} />
        <SingleProductInfo product={product} />
      </div>
      {reviews.length > 0 && (
        <SingleProductReviews reviews={reviews} productId={id} />
      )}
    </SidebarWithHeader>
  );
}

export default SingleProductPage;
