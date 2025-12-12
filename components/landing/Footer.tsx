"use client";

import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";

export default function Footer() {
	const { t } = useLanguage();
	const currentYear = new Date().getFullYear();

	const footerLinks = {
		product: [
			{ name: t("nav.courses"), href: "/courses" },
			{ name: t("nav.tutors"), href: "/tutors" },
			{ name: t("nav.for_tutors"), href: "/for-tutors" },
		],
		company: [
			{ name: t("landing.footer.links.aboutUs"), href: "/about" },
			{ name: t("landing.footer.links.helpCenter"), href: "/help" },
			{ name: t("landing.footer.links.contactUs"), href: "/contact" },
		],
		legal: [
			{ name: t("landing.footer.links.termsOfService"), href: "/terms" },
			{ name: t("landing.footer.links.privacyPolicy"), href: "/privacy" },
		],
	};

	return (
		<footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm">
			<div className="container mx-auto px-4 py-12">
				{/* Main footer content */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
					{/* Brand */}
					<div className="col-span-2 md:col-span-1">
						<Link href="/" className="inline-flex items-center gap-2 mb-4">
							<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
								<span className="text-primary-foreground font-bold text-sm">
									11
								</span>
							</div>
							<span className="text-xl font-semibold text-foreground">
								{t("app.name")}
							</span>
						</Link>
						<p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
							{t("app.tagline")}
						</p>
					</div>

					{/* Product */}
					<div>
						<h4 className="text-sm font-medium text-foreground mb-4">
							{t("landing.footer.resources")}
						</h4>
						<ul className="space-y-3">
							{footerLinks.product.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Company */}
					<div>
						<h4 className="text-sm font-medium text-foreground mb-4">
							{t("landing.footer.company")}
						</h4>
						<ul className="space-y-3">
							{footerLinks.company.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h4 className="text-sm font-medium text-foreground mb-4">
							{t("landing.footer.legal")}
						</h4>
						<ul className="space-y-3">
							{footerLinks.legal.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="pt-8 border-t border-border/40">
					<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
						<p className="text-sm text-muted-foreground">
							&copy; {currentYear} 11Tutors.{" "}
							{t("landing.footer.allRightsReserved")}
						</p>
						<p className="text-sm text-muted-foreground">
							{t("landing.footer.madeWithStudents")}
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
