type StirileCryptoAffiliationProps = {
  className?: string;
};

export default function StirileCryptoAffiliation({
  className,
}: StirileCryptoAffiliationProps) {
  return (
    <p className={className}>
      <a
        href="https://www.stirilecrypto.ro/autori/daniel-mihai"
        className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
      >
        Redactor la Știrile Crypto
      </a>{' '}
      (stirilecrypto.ro) — știri crypto în română. Consultanța de pe acest site
      este separată de publicație.
    </p>
  );
}
