"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

interface Testimonial {
	id: number
	name: string
	title: string
	image: string
	text: string
	rating: number
}

const testimonials: Testimonial[] = [
	{
		id: 1,
		name: "Fatou D.",
		title: "Développeuse Web Freelance",
		image: "/fatou.webp",
		text: "FreelanceTrack a totalement changé ma façon de gérer mes projets. En un coup d'œil je sais ce que j'ai livré, ce qui reste à encaisser, et combien j'ai gagné ce mois-ci.",
		rating: 5,
	},
	{
		id: 2,
		name: "Lamine K.",
		title: "UI/UX Designer Indépendant",
		image: "/lamine.webp",
		text: "Avant, je notais mes missions dans un carnet. Maintenant tout est centralisé, organisé et consultable partout. Un outil simple mais puissant.",
		rating: 5,
	},
	{
		id: 3,
		name: "Nadia M.",
		title: "Spécialiste Marketing Digital",
		image: "/nadia.webp",
		text: "J'adore voir mes revenus s'additionner mission après mission. C'est motivant et ça me pousse à m'organiser comme une vraie pro.",
		rating: 4,
	},
	{
		id: 4,
		name: "Yves T.",
		title: "Développeur No-Code",
		image: "/yves.webp",
		text: "Ce que j'apprécie, c'est la simplicité : j'ajoute une mission, je mets si c'est payé ou pas, et je vois tout sur mon dashboard. Rien à installer, rien de compliqué.",
		rating: 5,
	},
	{
		id: 5,
		name: "Clarisse A.",
		title: "Assistante Virtuelle Freelance",
		image: "/clarisse.webp",
		text: "Je peux enfin prouver à mes proches ce que je gagne réellement. FreelanceTrack me donne une vision claire de mon activité.",
		rating: 4,
	},
];


export default function TestimonialsCarousel() {
	const [api, setApi] = useState<CarouselApi | undefined>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!api) {
			return
		}

		setCount(api.scrollSnapList().length)
		setCurrent(api.selectedScrollSnap())

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap())
		})
	}, [api])

	const renderStars = (rating: number) => {
		return Array(5)
			.fill(0)
			.map((_, i) => (
				<Star
					key={i}
					className={cn("w-5 h-5", i < rating ? "fill-current text-primary" : "fill-muted stroke-muted-foreground")}
				/>
			))
	}

	return (
		<div className="w-full py-12 md:py-16 lg:py-20">
			<Carousel
				setApi={setApi}
				className="w-full"
				opts={{
					align: "start",
					loop: true,
					slidesToScroll: 1,
				}}
			>
				<CarouselContent className="-ml-2 md:-ml-4 py-4">
					{testimonials.map((testimonial) => (
						<CarouselItem key={testimonial.id} className="pl-2 md:pl-4 w-full sm:basis-1/2 md:basis-1/3">
							<Card className={cn("h-full border-0")}>
								<CardContent className="p-6">
									<div className="flex flex-col items-center text-center">
										<div className="relative w-20 h-20 mb-4 overflow-hidden rounded-full border-2 border-blue-600">
											<Image
												src={testimonial.image || "/placeholder.svg"}
												alt={testimonial.name}
												fill
												className="object-cover"
											/>
										</div>
										<h3 className="text-lg sm:text-xl font-semibold tracking-tight mb-1">
											{testimonial.name}
										</h3>
										<p className="text-xs sm:text-sm text-muted-foreground mb-2">
											{testimonial.title}
										</p>
										<p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-4 max-w-prose">
											{testimonial.text}
										</p>

										<div className="flex items-center justify-center">{renderStars(testimonial.rating)}</div>
									</div>
								</CardContent>
							</Card>
						</CarouselItem>
					))}
				</CarouselContent>
				<div className="flex items-center justify-center mt-8 gap-2">
					<CarouselPrevious className="relative transform-none mr-2" />
					<div className="flex gap-1">
						{Array(count)
							.fill(0)
							.map((_, i) => (
								<button
									key={i}
									className={cn(
										"w-2 h-2 rounded-full transition-all",
										current === i ? "bg-blue-600 w-4" : "bg-gray-300",
									)}
									onClick={() => api?.scrollTo(i)}
									aria-label={`Go to slide ${i + 1}`}
								/>
							))}
					</div>
					<CarouselNext className="relative transform-none ml-2" />
				</div>
			</Carousel>
		</div>
	)
}

