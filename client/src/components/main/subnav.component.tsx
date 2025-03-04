"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { subNavItems } from "@/data/clubs";
import Link from "next/link";
import clsx from "clsx";

const SubnavNavigation = () => {
    const router = useRouter();
    const pathname = usePathname();  // Lấy pathname hiện tại

    // Nếu pathname là "/home", chuyển hướng đến "/"
    useEffect(() => {
        if (pathname === "/home") {
            router.replace("/");  // Điều hướng về trang mặc định "/"
        }
    }, [pathname, router]);

    // Tạo biến currentTab dựa trên pathname
    const currentTab = pathname.split('/').pop() || "home";  // Lấy phần cuối của URL, ví dụ: /standings

    return (
        <div className="bg-white border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center overflow-x-auto whitespace-nowrap py-2">
                    {subNavItems.map((item) => {
                        const tab = item.toLowerCase().replace(/\s+/g, "-");

                        return (
                            <Link
                                key={tab}
                                href={tab === "home" ? "/" : `/${tab}`}  // Điều hướng đến "/" nếu là tab "Home"
                                className={clsx(
                                    "text-gray-700 hover:text-[#37003c] px-4 py-1 text-sm font-medium",
                                    { "border-b-4 border-[#0bffff]": currentTab === tab }  // Áp dụng underline
                                )}
                            >
                                {item}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SubnavNavigation;
