import { SectionHeading } from "./SectionHeading";
import { BarberCard } from "./BarberCard";
import type { Barber } from "@/types";

interface Props {
  barbers: Barber[];
}

export function BarbersSection({ barbers }: Props) {
  return (
    <section
      id="barbeiros"
      className="border-b border-border py-20 sm:py-28"
      aria-labelledby="barbers-heading"
    >
      <div className="container-section">
        <SectionHeading
          index="02"
          eyebrow="Barbeiros"
          title="Mestres do ofício"
          description="Conheça quem vai cuidar do seu estilo. Cada barbeiro tem sua especialidade — escolha aquele que combina com você."
        />

        <ul
          id="barbers-heading"
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {barbers.map((barber) => (
            <li key={barber.id}>
              <BarberCard barber={barber} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
