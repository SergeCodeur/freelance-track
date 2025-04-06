import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { DollarSign } from "lucide-react";

interface TotalRevenueProps {
	amount: number;
	currency: string;
}

export default function TotalRevenue({ amount, currency }: TotalRevenueProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">
					Revenu Total (Payé)
				</CardTitle>
				<DollarSign className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">
					{formatCurrency(amount, currency)}
				</div>
				{/* <p className="text-xs text-muted-foreground">
                    +20.1% depuis le mois dernier (Exemple)
                 </p> */}
			</CardContent>
		</Card>
	)
}