import AutoScroll from "embla-carousel-auto-scroll"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel"
import brandsData from '../data/brands.json'

export default function BrandStrip() {
  // Convert brand names to logo-like items for the carousel
  const brandItems = brandsData.map((name, index) => ({
    id: `brand-${index}`,
    name: name,
  }))

  return (
    <section className="py-8 bg-gray-50 border-y border-gray-200" aria-label="Trusted brands">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative flex items-center justify-center">
          <Carousel
            opts={{ 
              loop: true,
              align: "start",
              dragFree: true,
            }}
            plugins={[
              AutoScroll({
                playOnInit: true,
                speed: 0.5,
                stopOnInteraction: false,
                stopOnMouseEnter: false,
                stopOnFocusIn: false,
              })
            ]}
            className="w-full"
          >
            <CarouselContent className="ml-0 -mr-4">
              {brandItems.map((brand) => (
                <CarouselItem
                  key={brand.id}
                  className="flex basis-1/3 justify-center pl-0 pr-4 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <div className="mx-2 md:mx-4 flex shrink-0 items-center justify-center min-w-fit">
                    <div className="text-gray-400 font-bold text-base md:text-lg lg:text-xl uppercase tracking-wider hover:text-primary transition-colors whitespace-nowrap cursor-default">
                      {brand.name}
                    </div>
                  </div>
                </CarouselItem>
              ))}
              {/* Duplicate items for seamless infinite loop */}
              {brandItems.map((brand) => (
                <CarouselItem
                  key={`${brand.id}-duplicate`}
                  className="flex basis-1/3 justify-center pl-0 pr-4 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <div className="mx-2 md:mx-4 flex shrink-0 items-center justify-center min-w-fit">
                    <div className="text-gray-400 font-bold text-base md:text-lg lg:text-xl uppercase tracking-wider hover:text-primary transition-colors whitespace-nowrap cursor-default">
                      {brand.name}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          {/* Gradient fade effects */}
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
    </section>
  )
}
