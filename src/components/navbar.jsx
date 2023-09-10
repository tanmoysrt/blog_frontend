import {ArrowLeftOnRectangleIcon} from '@heroicons/react/24/outline'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHive} from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState } from 'react';
import Link from 'next/link';

const navigation = [
    { name: 'Manage Blog', href: '/admin/blog', editorAllowed: true },
    { name: 'Add Blog', href: '/admin/add', editorAllowed: true },
    { name: 'User Management', href: '/admin/user', editorAllowed: false }
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
    const [currentRoute, setCurrentRoute] = useState("");
    const [role, setRole] = useState("EDITOR");

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/admin";
    }

    useEffect(() => {
        setRole(localStorage.getItem("role"));
        setCurrentRoute(window.location.pathname);
    }, [currentRoute]);


    return (
        <div as="nav" className="bg-gray-800">
            <>
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex flex-shrink-0 items-center">
                                <FontAwesomeIcon className="h-8 w-auto lg:block text-white" icon={faHive} />
                            </div>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    {navigation.map((item) => (
                                        item.editorAllowed || (item.editorAllowed === false && role === "ADMIN") ?
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={classNames(
                                                item.href === currentRoute ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'rounded-md px-3 py-2 text-sm font-medium'
                                            )}
                                            aria-current={item.current ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </Link>
                                        : null
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 flex"
                            >
                                <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-1" aria-hidden="true" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

            </>
        </div>
    )
}
