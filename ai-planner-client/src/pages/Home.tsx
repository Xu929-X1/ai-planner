import React from 'react'
import { Link } from 'react-router-dom'


export default function Home() {

    return (
        <div>
            <h1>AI Planner</h1>
            <p>Welcome to the AI Planner application!</p>
            <p>This is a simple web application that allows you to plan your tasks and projects using AI.</p>
            <p>To get started, click on the "Create New Plan" button below.</p>
            <button><Link to={"/planner"}>
                Create New Plan
            </Link>
            </button>
        </div>
    )
}
