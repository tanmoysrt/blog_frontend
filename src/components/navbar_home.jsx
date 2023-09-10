import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHive} from "@fortawesome/free-brands-svg-icons";
import { Pacifico } from 'next/font/google'
import Link from "next/link";


const FontPacifico = Pacifico({
    weight: '400',
    subsets: ['latin'],
})

export default function NavbarHome() {
    return (
        <Link href="/" >
            <div className="flex justify-center items-center gap-4 mb-10">
                <FontAwesomeIcon icon={faHive} size="2xl" color="blue" />
                <h2 className={"text-2xl "+FontPacifico.className}>Road to Development</h2>
            </div>
        </Link>
    );
}