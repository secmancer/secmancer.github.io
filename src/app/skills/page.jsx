import Skill from "@/components/skill";

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-8">
      <br />
      <br />
      <Skill
        title="Security Operations"
        description="Experience working in a SOC and building relevant tools."
      />
      <Skill
        title="Operating Systems"
        description="Extensive knowledge of the Windows and Linux operating systems."
      />
      <Skill
        title="Centralized Services Administration"
        description="Managing and servicing several client networks."
      />
      <Skill
        title="Vulnerability Assessment"
        description="Scanning and finding possible vulnerabilities in a client's network."
      />
      <Skill
        title="Security Engineering"
        description="Building and maintaining security tools and services."
      />
      <Skill
        title="Information Technology"
        description="Experience in IT support and administration."
      />
      <Skill
        title="Programming Languages"
        description="Proficient in Python, Java, C++. Learning Rust."
      />
      <Skill
        title="Microsoft Office Suite"
        description="Proficient in Word, Excel, PowerPoint, and Outlook."
      />
      <Skill
        title="Web Development"
        description="Experience in building websites using HTML, CSS, and JavaScript."
      />
    </div>
  );
}
