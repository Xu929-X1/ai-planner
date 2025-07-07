import { useNotification } from "@/contexts/NotificationContext";

export default function DemoComponent() {
  const { showNotification } = useNotification();

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => showNotification("This is a success message!", "success")}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Show Success
      </button>
      <button
        onClick={() => showNotification("Something went wrong!", "error")}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Show Error
      </button>
      <button
        onClick={() => showNotification("Here's some info.", "info")}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Show Info
      </button>
      <button
        onClick={() => showNotification("This is a warning!", "warning")}
        className="px-4 py-2 bg-yellow-500 text-white rounded"
      >
        Show Warning
      </button>
    </div>
  );
}