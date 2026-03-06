"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
    return (
        <section className="w-full py-24 bg-neutral-50">
            <div className="container px-6 2xl:px-0">
                <div className="bg-white border border-neutral-100 p-12 md:p-20 shadow-sm relative overflow-hidden group">
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform duration-1000 group-hover:scale-110" />

                    <div className="max-w-4xl relative z-10 space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-6xl font-slogan text-neutral-900 leading-[1.1]">
                                Stay inspired. <br />
                                <span className="text-primary italic">Subscribe to our newsletter.</span>
                            </h2>
                            <p className="text-xl font-light text-neutral-600 max-w-2xl">
                                Subscribe to receive updates on modern office concepts, product launches, and inspiring workspaces.
                            </p>
                        </div>

                        <form className="flex flex-col md:flex-row gap-4 max-w-2xl">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 px-6 py-4 bg-neutral-50 border border-neutral-200 focus:border-primary outline-none transition-colors text-lg font-light"
                                required
                            />
                            <Button
                                size="lg"
                                className="bg-neutral-900 hover:bg-primary text-white px-10 h-auto py-5 uppercase tracking-widest text-sm font-bold"
                            >
                                Subscribe
                                <ArrowRight className="ml-3 w-5 h-5" />
                            </Button>
                        </form>

                        <p className="text-sm text-neutral-400 font-light max-w-xl leading-relaxed">
                            By subscribing, you agree to our Privacy Policy. You can unsubscribe at any time. We process your data to keep you informed about our products and services.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
