import { generateTourMetadata, renderTourDetail } from '../../components/TourDetailPage';

export async function generateMetadata({ params }) {
  return generateTourMetadata({ slug: params.slug, category: null });
}

export default async function TourDetailPage({ params }) {
  return renderTourDetail({ slug: params.slug, category: null });
}
