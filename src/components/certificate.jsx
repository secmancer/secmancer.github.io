export default function Cert({
  title,
  organization,
  date_of_issue,
  date_of_expiry,
  link,
}) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <h6 className="text-lg font-semibold">{organization}</h6>
      <p className="text-white">
        Issued on {date_of_issue} and expires on {date_of_expiry}
      </p>
    </div>
  );
}
