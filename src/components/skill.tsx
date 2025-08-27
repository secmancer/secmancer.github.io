type SkillProps = {
  title: string;
  description: string;
};

export default function Skill({ title, description }: SkillProps) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p>{description}</p>
    </div>
  );
}
