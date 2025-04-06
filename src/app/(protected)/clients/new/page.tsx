import ClientForm from "@/components/clients/client-form"; // Create this
import { Card, CardContent } from "@/components/ui/card";

export default function NewClientPage() {
	return (
		<div className="space-y-6 max-w-lg mx-auto">
			<h1 className="text-3xl font-bold tracking-tight">Nouveau Client</h1>
			<Card>
				<CardContent className="pt-6">
					{/* Initial client data is null for creation */}
					<ClientForm initialData={null} />
				</CardContent>
			</Card>
		</div>
	);
}