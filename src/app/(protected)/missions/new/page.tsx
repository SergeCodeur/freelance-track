import MissionForm from "@/components/missions/mission-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewMissionPage() {
	return (
		<div className="space-y-6 max-w-2xl mx-auto">
			<h1 className="text-3xl font-bold tracking-tight">Nouvelle Mission</h1>
			<Card>
				<CardHeader>
					<CardTitle>Ajouter une mission</CardTitle>
					<CardDescription>Remplissez les détails de votre nouvelle mission.</CardDescription>
				</CardHeader>
				<CardContent className="pt-6">
					{/* Initial mission data is null for creation */}
					<MissionForm initialData={null} />
				</CardContent>
			</Card>
		</div>
	);
}