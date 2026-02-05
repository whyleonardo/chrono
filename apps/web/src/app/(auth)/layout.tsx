import { Plasma } from "@/components/plasma";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen w-full">
			<div className="relative hidden flex-col items-center justify-center bg-neutral-100 p-12 lg:flex lg:w-1/2 dark:bg-[#0a0a0a]">
				<div className="absolute inset-0">
					<Plasma color="#d4a574" speed={0.3} />
				</div>

				<div className="relative z-10 max-w-md text-center">
					<p className="mb-8 text-foreground/90 text-xl leading-relaxed">
						<span className="font-medium text-foreground">
							I finally have a single place for all my daily reflections.
						</span>{" "}
						Chrono helped me build a habit of mindful journaling without the
						friction of traditional apps. The mood tracking and insights have
						transformed how I understand my emotional patterns.
					</p>

					<div className="inline-flex items-center gap-3 rounded-xl border border-muted bg-background/70 px-4 py-3 text-sm">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/30 font-medium text-primary">
							SK
						</div>
						<div className="text-left">
							<p className="font-medium text-foreground">Sarah Kim</p>
							<p className="text-muted-foreground">
								Product Designer • San Francisco
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="relative flex w-full flex-col items-center justify-center bg-background p-6 lg:w-1/2 lg:p-12">
				{children}
			</div>
		</div>
	);
}
