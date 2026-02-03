import { generateTourMetadata, renderTourDetail } from '../../components/TourDetailPage';

export async function generateMetadata({ params }) {
  return generateTourMetadata({ slug: params.slug, category: params.category });
}

export default async function CategoryTourPage({ params }) {
  return renderTourDetail({ slug: params.slug, category: params.category });
}
