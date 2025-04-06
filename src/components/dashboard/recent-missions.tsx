import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, getStatusBadgeColor, getStatusText } from "@/lib/utils";
import { MissionWithClient } from "@/store/mission-store"; // Adjust import path
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface RecentMissionsProps {
	missions: MissionWithClient[];
	currency: string;
}

export default function RecentMissions({ missions, currency }: RecentMissionsProps) {

	// const getInitials = (name?: string | null) => {
	// 	if (!name) return '??';
	// 	return name
	// 		.split(' ')
	// 		.map((n) => n[0])
	// 		.slice(0, 2)
	// 		.join('')
	// 		.toUpperCase();
	// };

	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle>Missions Récentes</CardTitle>
				<CardDescription>Les 3 dernières missions ajoutées.</CardDescription>
			</CardHeader>
			<CardContent>
				{missions.length === 0 ? (
					<p className="text-sm text-muted-foreground text-center py-4">Aucune mission récente.</p>
				) : (
					<div className="space-y-4">
						{missions.map((mission) => (
							<div key={mission.id} className="flex items-center justify-between space-x-4 p-2 hover:bg-muted/50 rounded-md">
								<div className="flex items-center space-x-3 flex-1 min-w-0">
									{/* Optional client avatar */}
									{/* <Avatar className="h-9 w-9 hidden sm:flex">
                                        <AvatarImage src="/avatars/01.png" alt="Avatar" /> // Placeholder image
                                        <AvatarFallback>{getInitials(mission.client.name)}</AvatarFallback>
                                     </Avatar> */}
									<div className="flex-1 min-w-0">
										<Link href={`/missions/${mission.id}/edit`} className="text-sm font-medium hover:underline truncate block" title={mission.title}>
											{mission.title}
										</Link>
										<Link href={`/clients/${mission.clientId}/edit`} className="text-xs text-muted-foreground hover:underline truncate inline-block" title={mission.client.name}>
											{mission.client.name}
										</Link>
									</div>
								</div>
								<div className="flex flex-col items-end space-y-1">
									<div className="text-sm font-medium">{formatCurrency(mission.amount, mission.currency || currency)}</div>
									<Badge variant="outline" className={`text-xs ${getStatusBadgeColor(mission.status)}`}>
										{getStatusText(mission.status)}
									</Badge>
								</div>

							</div>
						))}
					</div>
				)}
				{missions.length > 0 && (
					<div className="mt-4 text-center">
						<Button variant="outline" size="sm" asChild>
							<Link href="/missions">
								Voir toutes les missions <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	)
}