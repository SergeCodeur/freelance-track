"use client"

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { formatMonth, getMonthFromDate, getYearFromDate } from "@/lib/date-utils";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";
import { Mission } from "@prisma/client";
import { useTheme } from 'next-themes';

interface RevenueChartProps {
	missions: Mission[];
	currency: string;
}

export default function RevenueChart({ missions, currency }: RevenueChartProps) {
	const currentYear = getYearFromDate(new Date());
	const { theme } = useTheme()

	const chartData = React.useMemo(() => {
		const revenueMap = new Map<number, number>();

		missions.forEach(mission => {
			if (mission.status === 'paid') {
				try {
					const missionDate = new Date(mission.date || mission.createdAt);
					if (getYearFromDate(missionDate) === currentYear) {
						const monthIndex = getMonthFromDate(missionDate);
						revenueMap.set(monthIndex, (revenueMap.get(monthIndex) || 0) + mission.amount);
					}
				} catch (e) {
					console.warn("Invalid date:", e, mission.id, mission.date, mission.createdAt);
				}
			}
		});

		const data = Array.from({ length: 12 }, (_, i) => {
			const monthName = formatMonth(new Date(currentYear, i));
			return {
				month: monthName,
				total: revenueMap.get(i) || 0,
			};
		});

		return data;
	}, [missions, currentYear]);

	const maxValue = React.useMemo(() => {
		const max = Math.max(...chartData.map(d => d.total));
		return max > 0 ? Math.ceil(max * 1.1) : 100;
	}, [chartData]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Revenus par Mois</CardTitle>
				<CardDescription>Revenus des missions payées en {currentYear}.</CardDescription>
			</CardHeader>
			<CardContent>
				{chartData.every(d => d.total === 0) ? (
					<div className="h-[300px] flex items-center justify-center text-muted-foreground text-center p-4 border border-dashed rounded-md">
						Aucune donnée de revenu payé pour {currentYear}.
					</div>
				) : (
					<ChartContainer
						config={{ revenue: { label: "Revenu", color: "hsl(var(--primary))" } }}
						className="h-[300px] w-full"
					>
						<BarChart
							accessibilityLayer
							data={chartData}
							margin={{
								top: 5,
								right: 10,
								left: 10,
								bottom: 5,
							}}
						>
							<CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
							<XAxis
								dataKey="month"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={(value) => value}
								fontSize={12}
								className="fill-muted-foreground"
							/>
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								width={80}
								tickFormatter={(value) => formatCurrency(value, currency, 'fr-FR').replace(/\s*[A-Z]{3}$/, '')}
								domain={[0, maxValue]}
								fontSize={12}
								className="fill-muted-foreground"
							/>
							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent
										labelFormatter={(label) => `${label} ${currentYear}`}
										formatter={(value) => formatCurrency(Number(value), currency)}
										indicator="dot"
									/>
								}
							/>
							<Bar
								dataKey="total"
								fill={theme === "light" ? "#2b7fff" : "#155dfc"}
								radius={4}
							/>
						</BarChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	)
}