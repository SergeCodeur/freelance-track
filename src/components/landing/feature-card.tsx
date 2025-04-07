import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
	icon: React.ElementType;
	title: string;
	description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
	<Card className="text-center shadow-sm hover:shadow-md transition-shadow duration-300">
		<CardHeader>
			<div className="flex justify-center mb-2">
				<Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" strokeWidth={1.5} />
			</div>
			<CardTitle className="text-base sm:text-lg font-semibold tracking-tight">
				{title}
			</CardTitle>
		</CardHeader>
		<CardContent>
			<p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
				{description}
			</p>
		</CardContent>
	</Card>
);

export default FeatureCard;
