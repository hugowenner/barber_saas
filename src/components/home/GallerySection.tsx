import Image from "next/image";
import { SectionHeading } from "./SectionHeading";
import { GALLERY } from "@/data/gallery";

export function GallerySection() {
  return (
    <section
      id="ambiente"
      className="border-b border-border py-20 sm:py-28"
      aria-labelledby="gallery-heading"
    >
      <div className="container-section">
        <SectionHeading
          index="03"
          eyebrow="Ambiente"
          title="A barbearia"
          description="Um espaço pensado para você desacelerar. Som ambiente, café, e o cheiro de couro e navalha."
        />

        <ul
          id="gallery-heading"
          className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 lg:grid-cols-4"
        >
          {GALLERY.map((image, idx) => (
            <li
              key={image.id}
              className={
                // First image is the hero of the gallery (spans 2x2)
                idx === 0
                  ? "col-span-2 row-span-2"
                  : ""
              }
            >
              <figure className="group relative h-full w-full overflow-hidden rounded-lg border border-border bg-secondary">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes={
                    idx === 0
                      ? "(max-width: 1024px) 100vw, 50vw"
                      : "(max-width: 640px) 50vw, 25vw"
                  }
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
