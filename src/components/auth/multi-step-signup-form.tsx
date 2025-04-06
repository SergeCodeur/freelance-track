'use client';

import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { countries } from '@/constants/constants';
import { fetchCountryFromIP, freelancerTypes, getCurrencyFromCountry } from '@/lib/location';
import { RegisterSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Infer the type directly from the schema
type RegisterValues = z.infer<typeof RegisterSchema>;

export default function MultiStepSignupForm() {
	const [step, setStep] = useState(1);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
	const [isDetecting, setIsDetecting] = useState(true);
	const [countryOpen, setCountryOpen] = useState(false);
	const [countrySearch, setCountrySearch] = useState("");
	const router = useRouter();

	// Type useForm with RegisterValues (this already correctly types form.control)
	const form = useForm<RegisterValues>({
		resolver: zodResolver(RegisterSchema),
		// IMPORTANT: Default values should match the FINAL schema (RegisterValues)
		// 'confirmPassword' is not part of RegisterValues, handle its validation separately in step 1 trigger
		defaultValues: {
			name: '',
			email: '',
			password: '',
			country: '',
			currency: '',
			phone: '',
			freelancerType: '',
		},
		mode: 'onChange',
	});

	const selectedCountry = form.watch('country');

	// Filtered countries based on search
	const filteredCountries = countrySearch === ""
		? countries
		: countries.filter((country) =>
			country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
			country.code.toLowerCase().includes(countrySearch.toLowerCase())
		);

	// --- Country/Currency Effects ---
	useEffect(() => {
		const detectCountry = async () => {
			setIsDetecting(true);
			try {
				const countryCode = await fetchCountryFromIP(undefined);
				if (countryCode && countries.some(c => c.code === countryCode)) {
					setDetectedCountry(countryCode);
					if (!form.getValues('country')) {
						form.setValue('country', countryCode, { shouldValidate: true });
						const currency = getCurrencyFromCountry(countryCode);
						if (currency && !form.getValues('currency')) {
							form.setValue('currency', currency, { shouldValidate: true });
						}
					}
				}
			} catch (error) {
				console.error("Erreur de détection de pays :", error);
			} finally {
				setIsDetecting(false);
			}
		};

		if (step === 2 && !detectedCountry && !form.getValues('country')) { // Only detect if not already set
			detectCountry();
		} else if (step === 2) {
			setIsDetecting(false); // Ensure loading state is off if country already exists
		}
	}, [step, detectedCountry, form]);

	useEffect(() => {
		if (selectedCountry) {
			const currency = getCurrencyFromCountry(selectedCountry);
			if (currency && currency !== form.getValues('currency')) {
				form.setValue('currency', currency, { shouldValidate: true });
			} else if (!currency && form.getValues('currency')) {
				// Optionally clear currency if country changes to one without mapping
				// form.setValue('currency', '', { shouldValidate: true });
			}
		}
	}, [selectedCountry, form]);


	// --- Navigation and Submission ---
	const handleNext = async () => {
		setError(null);
		// Trigger validation for Step 1 fields + confirmPassword (which isn't in RegisterValues but exists in form state)
		// We need to access confirmPassword value for the check
		const step1Fields = ["name", "email", "password"] as const; // Fields from step 1 base schema
		const isValid = await form.trigger(step1Fields);


		if (isValid) {
			startTransition(async () => {
				try {
					const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(form.getValues('email'))}`);
					const data = await response.json();
					if (!response.ok || data.exists) {
						form.setError("email", { type: "manual", message: "Cet e-mail est déjà utilisé." });
						return;
					}
					setStep(2);
				} catch (err) {
					console.error("Vérification email échouée :", err);
					setError("Erreur lors de la vérification de l'e-mail.");
					toast.error("Erreur lors de la vérification de l'e-mail.");
				}
			});
		} else {
			console.log("Step 1 validation failed or passwords don't match");
			// Optionally scroll to the first error or give general feedback
		}
	};

	const handlePrevious = () => {
		if (step > 1) {
			setStep(step - 1);
			setError(null);
		}
	};

	const onSubmit = (values: RegisterValues) => {
		setError(null);
		if (step !== 2) return;

		startTransition(async () => {
			// Fields for step 2 validation (match SignupStep2Schema)
			const step2Fields = ["country", "currency", "phone", "freelancerType"] as const;
			const isValidStep2 = await form.trigger(step2Fields);

			if (!isValidStep2) {
				toast.warning("Veuillez corriger les erreurs dans le formulaire.");
				return;
			}

			// Values already represent RegisterValues (confirmPassword is omitted by schema type)
			const apiData = values;

			try {
				const response = await fetch('/api/auth/register', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(apiData),
				});

				const result = await response.json();

				if (!response.ok) {
					setError(result.message || "Une erreur s'est produite lors de l'inscription.");
					toast.error(result.message || "Échec de l'inscription");
				} else {
					toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
					router.push('/signin');
				}
			} catch (err) {
				console.error("Erreur lors de l'inscription :", err);
				setError("Une erreur réseau ou serveur s'est produite.");
				toast.error("Erreur réseau ou serveur.");
			}
		});
	};

	return (
		// Pass the correctly typed 'form' object from useForm
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{step === 1 && (
					<>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nom complet</FormLabel>
									<FormControl><Input placeholder="Jean Dupont" {...field} disabled={isPending} /></FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl><Input type="email" placeholder="exemple@email.com" {...field} disabled={isPending} /></FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mot de passe</FormLabel>
									<FormControl><Input type="password" placeholder="********" {...field} disabled={isPending} /></FormControl>
									<FormDescription>Minimum 8 caractères.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="button" className="w-full" onClick={handleNext} disabled={isPending}>
							{isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Suivant'}
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</>
				)}

				{step === 2 && (
					<>
						<FormField
							control={form.control}
							name="country"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Pays</FormLabel>
									{isDetecting && <p className='text-xs text-muted-foreground'>Détection du pays...</p>}

									<Popover open={countryOpen} onOpenChange={setCountryOpen}>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													role="combobox"
													aria-expanded={countryOpen}
													disabled={isPending}
													className={cn(
														"w-full justify-between",
														!field.value && "text-muted-foreground"
													)}
												>
													{field.value
														? countries.find(country => country.code === field.value)?.name
														: "Sélectionnez votre pays"}
													<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-full p-0">
											<Command>
												<CommandInput
													placeholder="Rechercher un pays..."
													value={countrySearch}
													onValueChange={setCountrySearch}
												/>
												<CommandList>
													<CommandEmpty>Aucun pays trouvé.</CommandEmpty>
													<CommandGroup className="max-h-[300px] overflow-auto">
														{filteredCountries.map((country) => (
															<CommandItem
																key={country.code}
																onSelect={() => {
																	form.setValue("country", country.code, { shouldValidate: true });
																	setCountryOpen(false);
																	setCountrySearch("");
																}}
															>
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		field.value === country.code ? "opacity-100" : "opacity-0"
																	)}
																/>
																{country.name}
															</CommandItem>
														))}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="currency"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Devise</FormLabel>
									<FormControl>
										<Input placeholder="Devise (auto)" readOnly disabled {...field} className="bg-muted/50 cursor-not-allowed" />
									</FormControl>
									<FormDescription>Définie automatiquement selon le pays.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Téléphone (Optionnel)</FormLabel>
									<FormControl><Input placeholder="+33 6 12 34 56 78" {...field} disabled={isPending} /></FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="freelancerType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Type de freelance</FormLabel>
									<Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
										<FormControl>
											<SelectTrigger><SelectValue placeholder="Sélectionnez votre domaine" /></SelectTrigger>
										</FormControl>
										<SelectContent>
											{freelancerTypes.map((type) => (
												<SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{error && (
							<div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
								<span className="font-semibold">Erreur :</span> {error}
							</div>
						)}

						<div className="flex justify-between">
							<Button type="button" variant="outline" onClick={handlePrevious} disabled={isPending}>
								<ArrowLeft className="mr-2 h-4 w-4" /> Précédent
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{isPending ? "Inscription en cours" : "S'inscrire"}
							</Button>
						</div>
					</>
				)}
			</form>
		</Form>
	);
}