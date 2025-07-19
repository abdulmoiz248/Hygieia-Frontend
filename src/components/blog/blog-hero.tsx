export function BlogHero() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-soft-blue/5 via-mint-green/5 to-soft-coral/5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-soft-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-mint-green/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-soft-coral/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-16 left-1/4 w-4 h-4 bg-soft-blue rounded-full animate-bounce delay-300"></div>
      <div className="absolute top-32 right-1/3 w-3 h-3 bg-mint-green rounded-full animate-bounce delay-700"></div>
      <div className="absolute bottom-24 left-1/3 w-5 h-5 bg-soft-coral rounded-full animate-bounce delay-1000"></div>

      <div className="relative max-w-6xl mx-auto text-center">
        <div className="inline-block mb-6">
          <span className="px-6 py-2 bg-gradient-to-r from-soft-blue/20 to-mint-green/20 rounded-full text-sm font-medium text-dark-slate-gray border border-soft-blue/30 backdrop-blur-sm">
            ✨ Latest Medical Insights & Research
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-dark-slate-gray via-soft-blue to-mint-green bg-clip-text text-transparent mb-8 leading-tight">
          Discover the Future of
          <span className="block bg-gradient-to-r from-soft-coral to-soft-blue bg-clip-text text-transparent">
            Healthcare
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-cool-gray mb-12 max-w-3xl mx-auto leading-relaxed">
          Stay ahead with cutting-edge research, expert insights, and breakthrough discoveries from the world&apos;s leading
          medical professionals.
        </p>

        {/* Enhanced Category Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
          <div className="group flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-soft-blue/20 hover:border-soft-blue/40 transition-all duration-300 hover:scale-105">
            <div className="w-3 h-3 bg-gradient-to-r from-soft-blue to-soft-blue/70 rounded-full group-hover:animate-pulse"></div>
            <span className="font-medium text-dark-slate-gray">Medical Research</span>
          </div>
          <div className="group flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-soft-coral/20 hover:border-soft-coral/40 transition-all duration-300 hover:scale-105">
            <div className="w-3 h-3 bg-gradient-to-r from-soft-coral to-soft-coral/70 rounded-full group-hover:animate-pulse"></div>
            <span className="font-medium text-dark-slate-gray">Nutrition Science</span>
          </div>
          <div className="group flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-mint-green/20 hover:border-mint-green/40 transition-all duration-300 hover:scale-105">
            <div className="w-3 h-3 bg-gradient-to-r from-mint-green to-mint-green/70 rounded-full group-hover:animate-pulse"></div>
            <span className="font-medium text-dark-slate-gray">Lab Technology</span>
          </div>
        </div>
      </div>
    </section>
  )
}
