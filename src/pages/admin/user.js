import {Fragment, useEffect, useRef, useState} from "react";
import Navbar from "@/components/navbar";
import {Dialog, Transition} from "@headlessui/react";
import ApiClient from "@/controllers/api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";


export default function () {

    let [isOpen, setIsOpen] = useState(false)
    let [users, setUsers] = useState([]);

    const dataRef = useRef({
        "firstname": "",
        "lastname": "",
        "username": "",
        "password": "",
        "role": ""
    });

    const apiclient = ApiClient.getInstance();

    function closeModal() {
        setIsOpen(false)
    }

    function openAddUserModal() {
        setIsOpen(true)
    }

    async function fetchUsers() {
        const response = await apiclient.request('get', '/auth/users');
        if(response.success) {
            setUsers(response.data);
        }
    }

    async function submitForm() {
        if(dataRef.current.firstname === "" || dataRef.current.lastname === "" || dataRef.current.username === "" || dataRef.current.password === "" || dataRef.current.role === ""){
            toast.error('Please fill all fields');
            return;
        }
        let route = '';
        if(dataRef.current.role === "ADMIN"){
            route = '/auth/register/admin';
        }else if(dataRef.current.role === "EDITOR"){
            route = '/auth/register/editor';
        }else{
            toast.error('Invalid role');
            return;
        }
        const response = await apiclient.request('post', route, dataRef.current);
        if(response.success) {
            toast.success('User created successfully');
            closeModal();
            fetchUsers();
        }
    }

    useEffect(() => {
        fetchUsers();
    },[])


    async function deleteUser(id) {
        const response = await apiclient.request('delete', '/auth/user/'+id);
        if(response.success) {
            toast.success('User deleted successfully');
            fetchUsers();
        }else{
            toast.error('Error deleting user');
        }
    }

    return (
        <>
            <Navbar/>
            {/*Add user button */}
            <div className="flex justify-end my-2 mr-8 mx-4">
                <button onClick={() => openAddUserModal()} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                    Add New User
                </button>
            </div>
            <div className="p-8 pt-2">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead
                            className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                ID
                            </th>
                            <th scope="col" className="px-6 py-3">
                                First Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Last Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Username
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Delete
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            users.map((user, index) =>
                                <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700" key={user.id}>
                                    <th scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {user.id}
                                    </th>
                                    <td className="px-6 py-4">
                                        {user.firstname}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.lastname}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-1 px-4 border border-red-500 hover:border-transparent rounded" onClick={()=>deleteUser(user.id)}><FontAwesomeIcon icon={faTrash} className="mr-2"  />Delete</button>
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>
            </div>

        {/*    Modal to add user */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                        </Transition.Child>
                        <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                    Add User
                                </Dialog.Title>
                                <div className="mt-2">
                                    <form className="w-full max-w-lg">
                                        <div className="flex flex-wrap -mx-3 mb-2">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                                    First Name
                                                </label>
                                                <input onChange={el => dataRef.current.firstname = el.target.value} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane"/>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-2">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                                                    Last Name
                                                </label>
                                                <input onChange={el => dataRef.current.lastname = el.target.value} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-last-name" type="text" placeholder="Doe"/>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-2">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-username">
                                                    Username
                                                </label>
                                                <input onChange={el => dataRef.current.username = el.target.value} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-username" type="text" placeholder="jane.doe"/>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-2">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                                                    Password
                                                </label>
                                                <input onChange={el => dataRef.current.password = el.target.value} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-password" type="password" placeholder="******************"/>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-4">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-role">
                                                    Role
                                                </label>
                                                <div className="relative">
                                                    <select onChange={el => dataRef.current.role = el.target.value} className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-role" defaultValue="ADMIN">
                                                        <option value="ADMIN">Admin</option>
                                                        <option value="EDITOR">Editor</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-2">
                                            <div className="w-full px-3">
                                                <button onClick={submitForm} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                                    Add User
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>

        </>
    );
}