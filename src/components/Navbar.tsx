import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-500 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          AWS
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
}
