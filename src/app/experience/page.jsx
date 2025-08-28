import Job from "@/components/job";

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-8">
      <br />
      <br />
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
        workplace="FIRST 3512 Spartatroniks"
        description="Lead the software team in developing the robot's code. Work with the mechanical and electrical teams to ensure the robot is functional. Manage our GitHub repo and deligate tasks to other software members. Also provide technician work to the robot during competitions."
        dates="August 2022 - May 2023"
      />
      <Job
        title="FIRST 3512 - Software Student"
        workplace="FIRST 3512 Spartatroniks"
        description="Program crucial aspects of the robot's code. Work with the mechanical and electrical teams to ensure the robot is functional."
        dates="June 2019 - Jun 2022"
      />
      <Job
        title="FIRST 3512 - Robotics Student"
        workplace="FIRST 3512 Spartatroniks"
        description="Help with planning the our first dinner auction event. Member of the winning Chairman's Award team at the 2022 Central Valley Regional."
        dates="June 2019 - Jun 2022"
      />
    </div>
  );
}
