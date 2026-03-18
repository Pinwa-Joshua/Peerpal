const footerLinks = {
    Platform: ["Browse Tutors", "How it Works", "Pricing", "Mobile App"],
    Support: ["Help Centre", "Trust & Safety", "Contact Us", "Tutor Guidelines"],
    Company: ["About Us", "Careers", "Blog", "Legal"],
};

export default function Footer() {
    return (
        <footer className="bg-white pt-16 pb-8 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <img
                                src="/icon.png"
                                alt="PeerPal"
                                className="h-8 w-auto opacity-80 hover:opacity-100 transition"
                            />
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
                            Empowering students to learn from each other. The trusted platform
                            for university peer tutoring.
                        </p>

                        {/* Social icons */}
                        <div className="flex space-x-4">
                            {/* Facebook */}
                            <a href="#" className="text-gray-400 hover:text-primary transition" aria-label="Facebook">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                    />
                                </svg>
                            </a>
                            {/* Twitter / X */}
                            <a href="#" className="text-gray-400 hover:text-primary transition" aria-label="Twitter">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a href="#" className="text-gray-400 hover:text-primary transition" aria-label="Instagram">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.944 2.013 9.284 2 11.714 2h.601zm0 1.802h-.517c-2.395 0-2.713.01-3.678.053-.95.044-1.467.2-1.81.333a3.097 3.097 0 00-1.15.748 3.097 3.097 0 00-.748 1.15c-.133.343-.29.86-.333 1.81-.043.964-.053 1.283-.053 3.678v.517c0 2.395.01 2.713.053 3.678.044.95.2 1.467.333 1.81.175.449.407.83.748 1.15.32.341.701.573 1.15.748.343.133.86.29 1.81.333.965.043 1.283.053 3.678.053h.517c2.395 0 2.713-.01 3.678-.053.95-.044 1.467-.2 1.81-.333a3.097 3.097 0 001.15-.748c.341-.32.573-.701.748-1.15.133-.343.29-.86.333-1.81.043-.965.053-1.283.053-3.678v-.517c0-2.395-.01-2.713-.053-3.678-.044-.95-.2-1.467-.333-1.81a3.097 3.097 0 00-.748-1.15 3.097 3.097 0 00-1.15-.748c-.343-.133-.86-.29-1.81-.333-.965-.043-1.283-.053-3.678-.053zm-.258 3.063a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 8.468a3.333 3.333 0 100-6.666 3.333 3.333 0 000 6.666zm6.538-8.671a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([heading, links]) => (
                        <div key={heading}>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                                {heading}
                            </h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-gray-500 hover:text-primary text-sm transition"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} PeerPal. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-sm text-gray-400 hover:text-gray-600">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-sm text-gray-400 hover:text-gray-600">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
