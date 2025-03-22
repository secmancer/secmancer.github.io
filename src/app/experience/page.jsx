import Job from "@/components/job";

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-8">
      <h1 className="text-4xl font-bold">Experience</h1>
      <Job
        title="Jr. SOC Analyst Student Assistant"
        workplace="California Polytechnic State University - San Luis Obispo"
        description="Defend against cyber threats and respond to security incidents. Handle reported emails and built projects to automate tasks."
        dates="March 2024 - Present"
      />
      <Job
        title="Cybersecurity Intern/Centralized Services Administrator"
        workplace="NGHTWLL Consulting LLC"
        description="Oversee and manage client networks. Provide updates and needed IT assistance. Provide services like vulnerability assessments and penetration testing when requested."
        dates="Janurary 2024 - Present"
      />
      <Job
        title="FIRST 3512 - Software Lead"
        description="Oversee and manage client networks. Provide updates and needed IT assistance. Provide services like vulnerability assessments and penetration testing when requested."
        dates="August 2022 - May 2023"
      />
    </div>
  );
}
