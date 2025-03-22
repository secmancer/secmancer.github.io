type CertProps = {
  title: string;
  organization: string;
  date_of_issue: string;
  date_of_expiry: string;
  link: string;
};

export default function Cert({
  title,
  organization,
  date_of_issue,
  date_of_expiry,
}: CertProps) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <h6 className="text-lg font-semibold">{organization}</h6>
      <p className="text-gray-500">
        Issued on {date_of_issue} and expires on {date_of_expiry}
      </p>
    </div>
  );
}
