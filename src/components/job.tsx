type JobProps = {
  title: string;
  workplace: string;
  description: string;
  dates: string;
};

export default function Job({
  title,
  workplace,
  description,
  dates,
}: JobProps) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <h3 className="text-lg font-semibold">{workplace}</h3>
      <p className="italic">{dates}</p>
      <p>{description}</p>
    </div>
  );
}
