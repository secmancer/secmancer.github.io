import Project from "@/components/project";

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-8">
      <h1 className="text-4xl font-bold">Projects</h1>
      <Project title="" description="test" />
      <Project title="" description="test" />
      <Project title="" description="test" />
      <Project title="" description="test" />
    </div>
  );
}
