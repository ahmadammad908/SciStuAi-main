'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Pagination({
    currentPage,
    totalPages,
}: {
    currentPage: number;
    totalPages: number;
}) {
    const pathname = usePathname();

    return (
        <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                    key={page}
                    href={`${pathname}/../${page}`} // Adjust path for nested routing
                    className={`px-4 py-2 rounded ${currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                >
                    {page}
                </Link>
            ))}
        </div>
    );
}