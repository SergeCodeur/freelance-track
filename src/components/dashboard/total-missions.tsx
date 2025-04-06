import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

interface TotalMissionsProps {
	total: number;
	pending: number;
	paid: number;
}

export default function TotalMissions({ total, pending, paid }: TotalMissionsProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">
					Total Missions
				</CardTitle>
				<Briefcase className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">
					{total}
				</div>
				<p className="text-xs text-muted-foreground">
					{paid} payées, {pending} en attente
				</p>
			</CardContent>
		</Card>
	)
}