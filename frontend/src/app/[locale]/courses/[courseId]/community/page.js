import Community from "@/features/Community/Community";

export default async function CourseCommunityPage({ params }) {
  const { courseId } = await params;

  return <Community courseId={courseId} />;
}