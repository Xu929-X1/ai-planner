import React from 'react'

export default function GoalInput() {
    return (
        <div>

            <button
                className="bg-blue-500 text-white rounded p-2 ml-2 text-lg"
                onClick={() => {
                    console.log("clicked")
                }}
            >Start Planning</button>
        </div>
    )
}
