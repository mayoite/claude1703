import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

interface ContactPersonProps {
    imageSrc: string;
    name: string;
    role: string;
    phone?: string;
    email?: string;
    location?: string;
}

export function ContactPerson({
    imageSrc,
    name,
    role,
    phone,
    email,
    location,
}: ContactPersonProps) {
    return (
        <div className="flex flex-col md:flex-row gap-6 items-start bg-neutral-50 p-6 border border-neutral-100 transition-colors hover:border-neutral-200 hover:bg-white group">
            <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 overflow-hidden rounded-full">
                <Image
                    src={imageSrc}
                    alt={name}
                    fill
                    sizes="128px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            <div className="space-y-3">
                <div>
                    <h4 className="text-xl font-light text-neutral-900 group-hover:text-primary transition-colors">
                        {name}
                    </h4>
                    <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
                        {role}
                    </p>
                </div>

                <div className="space-y-2 text-sm text-neutral-600">
                    {phone && (
                        <Link href={`tel:${phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                            <Phone className="w-4 h-4" />
                            {phone}
                        </Link>
                    )}
                    {email && (
                        <Link href={`mailto:${email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                            <Mail className="w-4 h-4" />
                            {email}
                        </Link>
                    )}
                    {location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {location}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
