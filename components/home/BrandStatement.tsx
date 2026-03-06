import { Reveal } from "@/components/shared/Reveal";

export function BrandStatement() {
    return (
        <section className="w-full bg-[#040C18] py-24 md:py-32">
            <div className="container px-6 2xl:px-0">
                <Reveal y={25}>
                    <p className="typ-lead text-white/90 max-w-4xl">
                        We&apos;ve been designing and installing India&apos;s workplaces since 2011.
                        Not interiors — working environments. The kind that help teams focus,
                        collaborate, and stay. Built for the organisations that can&apos;t afford
                        to get it wrong.
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
