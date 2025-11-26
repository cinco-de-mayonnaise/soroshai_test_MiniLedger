import Home from "./pages/Home";

export default function App() {
  return (
    // in the future we might need to move to other pages, App() is the entry-point of our webapp.
    <div className="min-h-screen text-gray-900">
      <Home />
    </div>
  );
}
