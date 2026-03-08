import { Link } from "react-router-dom";

export default function CallToAction() {
    return (
        <section className="py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-primary rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
                    {/* Decorative blurs */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary opacity-20 rounded-full blur-3xl" />

                    <h2 className="relative text-3xl md:text-4xl font-display font-bold text-white mb-6">
                        Ready to boost your grades?
                    </h2>
                    <p className="relative text-blue-200 text-lg mb-10 max-w-2xl mx-auto">
                        Join thousands of students who are mastering their courses with
                        PeerPal today.
                    </p>

                    <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/get-started"
                            className="bg-white text-primary hover:bg-gray-100 font-bold py-3.5 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1"
                        >
                            Get Started for Free
                        </Link>
                        <Link
                            to="/get-started"
                            className="border-2 border-white text-white hover:bg-white/10 font-bold py-3.5 px-8 rounded-full transition transform hover:-translate-y-1"
                        >
                            Become a Tutor
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
