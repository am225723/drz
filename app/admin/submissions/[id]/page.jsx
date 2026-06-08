import SubmissionCommunications from '../../../../components/admin/SubmissionCommunications';

export const metadata = { title: 'Admin Submission | Integrative Psychiatry' };

export default function AdminSubmissionDetailPage({ params }) {
  return <SubmissionCommunications id={params.id} />;
}
