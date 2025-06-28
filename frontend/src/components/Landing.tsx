"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  CheckCircle2,
  Globe,
  Menu,
  Rocket,
  Star,
  User,
  X,
  Clock,
  Shield,
  Award,
} from "lucide-react";

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-sm shadow-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <a href="/" className="flex items-center space-x-2">
                <div className="relative w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  JobConnect
                </span>
              </a>
              <div className="hidden md:flex space-x-8">
                <a
                  href="/how-it-works"
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  How It Works
                </a>
                <a
                  href="/pricing"
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Pricing
                </a>
                <a
                  href="/about"
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  About
                </a>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="/company/signup"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Become an Company
              </a>
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
              >
                Sign Up
              </a>
            </div>
            <div className="md:hidden">
              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 w-10"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="p-4 flex justify-between items-center border-b">
            <a href="/" className="flex items-center space-x-2">
              <div className="relative w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                JobConnect
              </span>
            </a>
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 w-10"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4 flex flex-col space-y-4">
            <a
              href="/how-it-works"
              className="text-gray-600 hover:text-blue-600 font-medium py-3 border-b"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="/pricing"
              className="text-gray-600 hover:text-blue-600 font-medium py-3 border-b"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="/about"
              className="text-gray-600 hover:text-blue-600 font-medium py-3 border-b"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <div className="pt-4 flex flex-col space-y-3">
              <a
                href="/signup?role=company"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full text-center"
              >
                For Companies
              </a>
              <a
                href="/signup?role=user"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 w-full text-center"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Connecting <span className="text-blue-600">Ambitious</span>{" "}
                Companies with <span className="text-blue-600">Top Talent</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
                Find the right job. Hire the right people. Simple, fast, and
                efficient platform for modern careers.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href="/signup?role=company"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-12 px-6 py-3 text-base"
                >
                  Hire Now
                </a>
                <a
                  href="/signup?role=user"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-6 py-3 text-base"
                >
                  Find Jobs
                </a>
              </div>
              <div className="mt-8 flex items-center justify-center md:justify-start space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                    >
                      <img
                        src={`https://randomuser.me/api/portraits/men/${
                          i + 10
                        }.jpg`}
                        alt={`User ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-blue-600">2,500+</span> jobs
                  posted this week
                </p>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-lg"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-lg"></div>
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                  alt="Professional team working"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 font-medium mb-8">
            Trusted by leading companies worldwide
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-12 flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
              >
                <img
                  src={`https://brandlogos.net/wp-content/uploads/2020/0${i}/logo-${i}00x600.png`}
                  alt={`Company ${i} logo`}
                  className="h-8 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform makes hiring and job searching simple and efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* For Companies */}
            <div className="rounded-lg shadow-lg overflow-hidden border-0">
              <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-500 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <Briefcase className="w-40 h-40 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <Briefcase className="w-6 h-6 mr-2" />
                    For Companies
                  </h3>
                </div>
              </div>
              <div className="p-6 bg-white">
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        Post jobs and manage candidates
                      </p>
                      <p className="text-sm text-gray-500">
                        Create detailed job listings and track applicants in one
                        place
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        Schedule interviews seamlessly
                      </p>
                      <p className="text-sm text-gray-500">
                        Integrated calendar system for booking and managing
                        interviews
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Hire the best talent fast</p>
                      <p className="text-sm text-gray-500">
                        AI-powered matching to find the perfect candidates for
                        your roles
                      </p>
                    </div>
                  </li>
                </ul>
                <a
                  href="/signup?role=company"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 w-full mt-6 text-center"
                >
                  Get Started
                </a>
              </div>
            </div>

            {/* For Users */}
            <div className="rounded-lg shadow-lg overflow-hidden border-0">
              <div className="h-48 bg-gradient-to-r from-indigo-600 to-indigo-500 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <User className="w-40 h-40 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <User className="w-6 h-6 mr-2" />
                    For Job Seekers
                  </h3>
                </div>
              </div>
              <div className="p-6 bg-white">
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        Create your profile in minutes
                      </p>
                      <p className="text-sm text-gray-500">
                        Build a professional profile that showcases your skills
                        and experience
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        Apply to jobs with one click
                      </p>
                      <p className="text-sm text-gray-500">
                        Streamlined application process saves you time and
                        effort
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        Track your application status
                      </p>
                      <p className="text-sm text-gray-500">
                        Real-time updates on your applications and interview
                        requests
                      </p>
                    </div>
                  </li>
                </ul>
                <a
                  href="/signup?role=user"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full mt-6 text-center"
                >
                  Create Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing how companies and talent connect
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Rocket className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">
                Fast Hiring
              </h3>
              <p className="text-gray-600 text-center">
                Reduce your time-to-hire by up to 50% with our streamlined
                process
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">
                Verified Companies
              </h3>
              <p className="text-gray-600 text-center">
                All employers are thoroughly vetted to ensure quality
                opportunities
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">
                Resume Tools
              </h3>
              <p className="text-gray-600 text-center">
                AI-powered resume builder and optimization to help you stand out
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 bg-amber-100 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">
                24/7 Support
              </h3>
              <p className="text-gray-600 text-center">
                Our dedicated team is always available to help with-any
                questions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thousands of companies and professionals trust JobConnect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Amazing platform! I found my dream job in just 10 days. The interface is intuitive and the job matching algorithm is spot on.",
                name: "Jane Doe",
                title: "Software Engineer",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
              },
              {
                quote:
                  "We hired 5 developers in 2 weeks. The quality of candidates was exceptional and the hiring process was seamless. Highly recommend!",
                name: "John Smith",
                title: "CTO at TechCorp",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
              },
              {
                quote:
                  "The best job portal I've ever used. Simple, efficient, and effective. I've recommended JobConnect to all my colleagues.",
                name: "Sarah Johnson",
                title: "Marketing Director",
                image: "https://randomuser.me/api/portraits/women/68.jpg",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-lg border-0 p-6"
              >
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Job Postings" },
              { number: "2.5M+", label: "Active Users" },
              { number: "85%", label: "Success Rate" },
              { number: "50+", label: "Countries" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-lg">
                Join thousands of professionals who have already found their
                dream jobs through JobConnect. Your next opportunity is just a
                click away.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href="/signup?role=user"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-blue-600 hover:bg-gray-100 h-12 px-6 py-3 text-base"
                >
                  Create Your Profile
                </a>
                <a
                  href="/browse-jobs"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white text-white bg-transparent hover:bg-white/10 h-12 px-6 py-3 text-base"
                >
                  Browse Jobs
                </a>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/10 rounded-lg"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-lg"></div>
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                  alt="Happy professionals"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <a href="/" className="flex items-center space-x-2 mb-6">
                <div className="relative w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-white">
                  JobConnect
                </span>
              </a>
              <p className="text-gray-400 mb-6">
                Connecting talent with opportunity worldwide. The smarter way to
                hire and get hired.
              </p>
              <div className="flex space-x-4">
                {["twitter", "linkedin", "facebook", "instagram"].map(
                  (social) => (
                    <a
                      key={social}
                      href={`#${social}`}
                      className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      <Globe className="w-5 h-5" />
                    </a>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">For Job Seekers</h3>
              <ul className="space-y-4">
                {[
                  "Browse Jobs",
                  "Create Profile",
                  "Career Resources",
                  "Salary Guide",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">For Companies</h3>
              <ul className="space-y-4">
                {[
                  "Post a Job",
                  "Talent Search",
                  "Pricing",
                  "Enterprise Solutions",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Company</h3>
              <ul className="space-y-4">
                {[
                  "About Us",
                  "Contact",
                  "Privacy Policy",
                  "Terms of Service",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} JobConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
