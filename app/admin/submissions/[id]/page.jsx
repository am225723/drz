import { SubmissionDetail } from '../../../../components/admin/AdminComponents';

export const metadata = { title: 'Admin Submission | Integrative Psychiatry' };

export default function AdminSubmissionDetailPage({ params }) {
  return <SubmissionDetail id={params.id} />;
}
