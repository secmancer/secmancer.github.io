import Project from "@/components/project";

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-8">
      <br />
      <br />
      <Project
        title="Robot-2020"
        description="Source code for FRC 3512's 2020 robot"
        link="https://github.com/frc3512/Robot-2020"
      />
      <Project
        title="Robot-2022"
        description="Source code for FRC 3512's 2022 robot"
        link="https://github.com/frc3512/Robot-2022"
      />
      <Project
        title="SwerveRobot-2022"
        description="Offseason swerve code for the 2022 season. Quite extensively used by other teams."
        link="https://github.com/frc3512/SwerveBot-2022"
      />
      <Project
        title="Robot-2023"
        description="Source code for FRC 3512's 2023 robot"
        link="https://github.com/frc3512/Robot-2023"
      />
      <Project
        title="Oh What Fun!"
        description="A Minecraft mod I built for ModFest 1.17. Adds ridable sleds into the game."
        link="https://github.com/secmancer/oh_what_fun"
      />
      <Project
        title="Portfolio"
        description="This very website! Built with Next.js and Tailwind CSS."
        link="https://github.com/secmancer/secmancer.github.io"
      />
      <Project
        title="Lineage"
        description="An app for users/authors everywhere to create and collaborate on intricate storylines. Built as a team of other students in Intro to Software Engineering."
        link="https://github.com/secmancer/lineage"
      />
      <br />
      <h1 className="text-2xl">
        <b>Currently Working on:</b>
      </h1>
      <Project
        title="Sec-Tools"
        description="Repo with custom built security tools as a learning opportunity. Written in different languages for practice as well."
        link="Coming soon!"
      />
    </div>
  );
}
