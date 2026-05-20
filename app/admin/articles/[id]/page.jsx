import { ArticlesAdmin } from '../../../../components/admin/AdminComponents';

export const metadata = { title: 'Edit Article | Integrative Psychiatry' };

export default function EditArticlePage({ params }) {
  return <ArticlesAdmin id={params.id} />;
}
