export default function Skill({ title, description }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p>{description}</p>
    </div>
  );
}
