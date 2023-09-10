import BlogCard from "@/components/card";
import NavbarHome from "@/components/navbar_home";
import { useEffect, useState } from "react";
import ApiClient from "@/controllers/api";

export default function HomePage(){
    const [blogs, setBlogs] = useState([]);
    const apiClient = ApiClient.getInstance();

    async function fetchBlogs() {
        const response = await apiClient.request("get", "/blog/all");
        if (response.success) {
            setBlogs(response.data);
        } else {
            toast.error("Failed to fetch blogs");
        }
    }

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <div className="p-6 w-[100vw] flex flex-col justify-center">
            <NavbarHome />

            {/* Blog cards */}
            <div className="flex flex-wrap gap-12 justify-center mx-14">
                {
                    blogs.map((blog, index) => <BlogCard key={index} blog={blog} /> )
                }
            </div>
        </div>
    )
}