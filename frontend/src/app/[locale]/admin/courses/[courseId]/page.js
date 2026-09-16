import AdminCourseDetail from "@/features/AdminCourseDetail/AdminCourseDetail";

export default async function AdminCourseDetailPage({ params }) {
  const { courseId } = await params;

  return <AdminCourseDetail courseId={courseId} />;
}
