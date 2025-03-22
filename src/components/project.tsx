type ProjectProps = {
  title: string;
  description: string;
  link: string;
};

export default function Project({ title, description, link }: ProjectProps) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p>{description}</p>
      <a href={link} className="text-blue-500">
        {link}
      </a>
    </div>
  );
}
