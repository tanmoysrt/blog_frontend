import {useEffect, useState} from "react";
import Navbar from "@/components/navbar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLink, faPencil, faTrash} from "@fortawesome/free-solid-svg-icons";
import ApiClient from "@/controllers/api";
import { toast } from "react-hot-toast";
import Link from "next/link";
 

export default function () {

    const [data, setData] = useState([]);
    const [role, setRole] = useState("EDITOR");
    const apiClient = ApiClient.getInstance();

    async function fetchBlogs() {
        const found_role = localStorage.getItem("role");
        let response;
        if(found_role === "ADMIN"){
            response = await apiClient.request("get", "/blog/all");
        }else{
            response = await apiClient.request("get", "/blog/all/filtered");
        }
        if (response.success) {
            setData(response.data);
        } else {
            toast.error("Failed to fetch blogs");
        }
    }

    async function deleteBlog(id) {
        const response = await apiClient.request("delete", "/blog/" + id);
        if (response.success) {
            toast.success("Blog deleted successfully");
            fetchBlogs();
        } else {
            toast.error("Failed to delete blog");
        }
    }

    useEffect(() => {
        fetchBlogs();
        const found_role = localStorage.getItem("role");
        if (found_role) {
            setRole(found_role);
        }
    }, []);

    return (
        <>
            <Navbar/>
            <div className="p-8">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Topics
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Author
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item, index) => <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                    <th scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <Link target="_blank" href={`/blog/${item.id}`}><FontAwesomeIcon icon={faLink} className="text-blue-400 mr-5" /></Link>
                                        {item.title}
                                    </th>
                                    <td className="px-6 py-4">
                                        {item.topics}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.author.firstname + " " + item.author.lastname}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/admin/blog/edit/${item.id}`} className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-500 py-2 px-2 rounded-md cursor-pointer	">
                                            <FontAwesomeIcon icon={faPencil} size="sm" /> Edit
                                        </Link>
                                        {
                                            role == "ADMIN" ? <>
                                                &nbsp;&nbsp;&nbsp;
                                                <a className="bg-red-500 hover:bg-red-700 text-white text-sm font-500 py-2 px-2 rounded-md cursor-pointer" onClick={()=>deleteBlog(item.id)}>
                                                    <FontAwesomeIcon icon={faTrash} size="sm" /> Delete
                                                </a>
                                            </> : null
                                        }

                                    </td>
                                </tr>
                                )
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}