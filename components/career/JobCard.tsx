"use client";

import { Button } from "@/components/ui/Button";

interface JobCardProps {
    title: string;
    department: string;
    location?: string;
    onClick?: () => void;
}

export function JobCard({ title, department, location = "Patna", onClick }: JobCardProps) {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-neutral-50 border border-neutral-100 hover:border-primary transition-all duration-300 group">
            <div>
                <h3 className="text-lg font-medium text-neutral-900 group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-neutral-500 font-light mt-1">
                    {location} | {department}
                </p>
            </div>
            <Button
                variant="outline"
                className="mt-4 md:mt-0 bg-white hover:bg-neutral-900 hover:text-white border-neutral-200"
                onClick={onClick}
            >
                View Details
            </Button>
        </div>
    );
}
