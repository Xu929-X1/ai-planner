import { Link } from 'react-router-dom';


export default function NotFound() {
    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold border-b">
                404 - Page Not Found
            </h1>
            <h2 className="text-gray-600">
                Sorry, the page you are looking for does not exist.
            </h2>
            <button type="button" className=" text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
                <Link to="/">Go back to Home</Link>
            </button>
        </div>
    );
}
