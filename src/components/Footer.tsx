export default function Footer() {
  return (
    <footer className="bg-gray-500 text-white py-4 ">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm">
        © {new Date().getFullYear()} MyApp. All rights reserved.
      </div>
    </footer>
  );
}
