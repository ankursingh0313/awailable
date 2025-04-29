import Logo from "./Logo";

export default function Navbar() {
  return (
    <header className="w-full p-4 shadow-lg bg-gray-200 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />
        {/* You can add links or buttons on the right if needed */}
        <a
          href="https://github.com/ankursingh0313"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-gray-500 hover:text-[#4e60c6] transition"
        >
          @ankursingh0313
        </a>
      </div>
    </header>
  );
}
