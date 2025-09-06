export function BlogHero() {
  return (
    <section className="relative pt-18 pb-0 px-4 overflow-hidden">
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

       
      </div>
    </section>
  )
}
