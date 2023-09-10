import Navbar from "@/components/navbar";
import { useRef, useState } from "react";
import ApiClient from "@/controllers/api";
import { toast } from "react-hot-toast";
import { data } from "autoprefixer";

export default function AddFlight() {
    const [uploading, setUploading] = useState(false);
    const [uploadedImageName, setUploadedImageName] = useState("");
    const dataRef = useRef({
        "title": "",
        "content": "",
        "coverImage": "",
        "topics": ""
    })
    const imageUploadRef = useRef(null);
    const contentFieldRef = useRef(null);
    const apiClient = ApiClient.getInstance();

    async function uploadImage(files){
        if(files.length === 0){
            toast.error("Please select a file");
            return;
        }
        const file = files[0];
        setUploading(true);
        const res = await apiClient.uploadFile(file);
        if(res.success){
            toast.success("Image uploaded successfully");
            dataRef.current.coverImage = res.link;
            setUploadedImageName(res.link);
        }
        else{
            toast.error("Failed to upload image");
        }
        setUploading(false);
    }

    async function addBlog(){
        if(uploading) return;
        if(dataRef.current.title === "" || dataRef.current.content === "" || dataRef.current.coverImage === "" ){
            toast.error("Please fill all the fields");
            return;
        }
        const response = await apiClient.request("post", "/blog", dataRef.current);
        if (response.success) {
            toast.success("Blog added successfully");
            window.location.href = "/admin/blog";
        } else {
            toast.error("Failed to add blog");
        }
    }

    async function insertImage(){
        const files = imageUploadRef.current.files;
        if(files.length === 0){
            toast.error("Please select a image first");
            return;
        }
        const file = files[0];
        setUploading(true);
        const res = await apiClient.uploadFile(file);
        if(res.success){
            toast.success("Image uploaded successfully");
            const actualLink = apiClient.getLinkFromFileName(res.link);
            contentFieldRef.current.value += `![IMAGE TAG HERE](${actualLink})`;
            dataRef.current.content = contentFieldRef.current.value;
        }
        else{
            toast.error("Failed to upload image");
        }
        imageUploadRef.current.value = "";

        setUploading(false);
    }


    return (
        <>
            <Navbar />
            <div className="p-8">
                <div className="grid gap-6 mb-6 md:grid-cols-1">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                        <input onChange={(e)=>dataRef.current.title = e.target.value} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cover Image {
                            uploadedImageName != "" ?
                                <a target="_blank"  className="text-blue-500 underline" href={apiClient.getLinkFromFileName(uploadedImageName)}>{dataRef.current.coverImage}</a>
                            : null
                        }</label>
                        <input type="file" onChange={(e)=>uploadImage(e.target.files)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required accept="image/*" />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Blog</label>
                        <textarea ref={contentFieldRef} onChange={(e)=>dataRef.current.content = e.target.value} rows="20" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required></textarea>
                    </div>
                    <div className="flex flex-row gap-6">
                        <input ref={imageUploadRef} type="file"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required accept="image/*" />
                        <button onClick={insertImage} className="bg-blue-500 hover:bg-blue-700 text-white text-base font-bold py-1 px-4 rounded-md">Insert Image In Blog</button>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Topics (Multiple topics seperated by comma)</label>
                        <input onChange={(e)=>dataRef.current.topics = e.target.value} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                    </div>

                </div>
                <div className="flex gap-5 mt-2 w-full">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white text-base font-bold py-1 px-4 rounded-md" onClick={addBlog} disabled={uploading}>
                        {
                            uploading ? <>Uploading Image</> : <>Submit</>
                        }
                    </button>
                </div>
            </div>
        </>
    );
}