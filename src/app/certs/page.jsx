import Cert from "@/components/certificate";

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-8">
      <br />
      <br />
      <Cert
        title="CompTIA Security+"
        organization="CompTIA"
        date_of_issue="September 2023"
        date_of_expiry="September 2026"
      />
      <Cert
        title="CompTIA ITF+"
        organization="CompTIA"
        date_of_issue="March 2023"
        date_of_expiry="N/A"
      />
      <br />
      <h1 className="text-2xl">
        <b>Currently Working on:</b>
      </h1>
      <Cert
        title="CCNA (Cisco Certified Network Associate)"
        organization="Cisco"
        date_of_issue="TBD"
        date_of_expiry="TBD"
      />
      <Cert
        title="CISSP (Certified Information Systems Security Professional)"
        organization="ISC2"
        date_of_issue="TBD"
        date_of_expiry="TBD"
      />
    </div>
  );
}
