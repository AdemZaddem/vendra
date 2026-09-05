const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return <p>Dashboard for: {slug}</p>;
};
export default Page;
