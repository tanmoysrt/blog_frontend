import { faGlasses, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import ApiClient from "@/controllers/api";

export default function BlogCard({blog}){
    const apiClient = ApiClient.getInstance();

    function formatdate(date){
        // from 'yyyy-mm-dd' to 12th June, 2021
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dateArray = date.split("-");
        const year = dateArray[0];
        const month = months[parseInt(dateArray[1]) - 1];
        const day = dateArray[2];
        return `${day}th ${month}, ${year}`;
    }

    function calculateReadingTime(text){
        // calculate reading time -- 200 words per minute
        const wordsPerMinute = 200;
        const noOfWords = text.split(/\s/g).length;
        const minutes = noOfWords / wordsPerMinute;
        const readTime = Math.ceil(minutes);
        return Math.max(readTime, 1);
    }

    return (
        <Link href={"/blog/"+blog.id.toString()}>
            <div key={blog.id} className="max-w-sm overflow-hidden shadow-md hover:shadow-2xl cursor-pointer border border-gray-200 rounded-md">
                <img className="aspect-video object-fill" src={apiClient.getLinkFromFileName(blog.coverImage)} alt={blog.title} />
                    <div className="px-6 py-4">
                        <p className="font-bold text-xl mb-2 text-ellipsis block w-full whitespace-nowrap overflow-hidden">{blog.title}</p>
                        <p className="text-black-700 text-base mb-2">
                            Written by <i>{blog.author.firstname} {blog.author.lastname}</i>
                        </p>
                        <p className="text-gray-700 text-base mb-0">
                            <FontAwesomeIcon icon={faPaperPlane} /> Published on {formatdate(blog.date)}
                        </p>
                        <p className="text-gray-700 text-base mb-0">
                            <FontAwesomeIcon icon={faGlasses} /> {calculateReadingTime(blog.content)} min read
                        </p>
                    </div>
                    <div className="px-6 pb-2">
                        {
                            blog.topics.split(",").map((topic, index) => {
                                return <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{topic}</span>
                            })
                        }
                    </div>
            </div>
        </Link>
    );
}