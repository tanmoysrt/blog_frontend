import NavbarHome from "@/components/navbar_home";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Poppins } from "next/font/google";
import matter from "gray-matter";
import md from "markdown-it";
var taskLists = require('markdown-it-task-lists');
import ApiClient from "@/controllers/api";

const FontPoppins = Poppins({
    weight: '500',
    styles: ["regular"],
    subsets: ["latin"],
});



export default function BlogPage({ frontMatter, content, coverImageLink, authorName, title , date}) {
    return (
        <div className="p-6 w-[100vw] flex flex-col justify-center items-center">
            <NavbarHome />

            <div className="w-3/6 flex flex-col justify-center">
                {/* Image */}
                <img className="w-full" src={coverImageLink} alt="Sunset in the mountains" />
                {/* Title */}
                <div className={"font-semibold text-4xl my-4 text-center "+FontPoppins.className}>{title}</div>
                {/* Author name and date */}
                <p className="text-black-700 text-base mb-1 text-center">
                    Written by <i>{authorName}</i>
                </p>
                <p className="text-gray-700 text-base mb-1 text-center">
                    <FontAwesomeIcon icon={faPaperPlane} /> Published on {formatdate(date)}
                </p>

                {/* Blog */}
                <article
                    className='prose lg:prose-xl mt-8'
                    dangerouslySetInnerHTML={{ __html: md().use(taskLists).render(content) }}
                />
            </div>
        </div>
    );
}


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

export async function getServerSideProps({ params: { id } }) {
    const apiClient = ApiClient.getInstance();
    const response = await apiClient.request("get", `/blog/${id}`);
    if(!response.success){
        return {
            notFound: true,
        }
    }
    // get content for each blog
    console.log(id);
    const markdown = response.data.content;
    const { data: frontMatter, content } = matter(markdown);

  
    return {
      props: {
        frontMatter,
        content,
        coverImageLink: apiClient.getLinkFromFileName(response.data.coverImage),
        title: response.data.title,
        authorName : response.data.author.firstname + " " + response.data.author.lastname,
        date: response.data.date,
      },
    };
  }