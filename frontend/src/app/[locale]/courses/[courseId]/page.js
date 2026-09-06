import CourseDetail from "@/features/CourseDetail/CourseDetail";

export default async function CourseDetailPage({ params }) {
  const { courseId } = await params;

  return <CourseDetail courseId={courseId} />;
}