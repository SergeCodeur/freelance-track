import { Avatar, AvatarFallback } from "../ui/avatar";

interface TargetProfileProps {
	icon: React.ElementType;
	label: string;
}

const TargetProfile: React.FC<TargetProfileProps> = ({ icon: Icon, label }) => (
	<div className="flex flex-col items-center text-center">
		<Avatar className="mb-2 h-16 w-16 bg-secondary flex items-center justify-center">
			<AvatarFallback className="bg-transparent">
				<Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary/80" strokeWidth={1.5} />
			</AvatarFallback>
		</Avatar>
		<p className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight">
			{label}
		</p>
	</div>
);

export default TargetProfile;
