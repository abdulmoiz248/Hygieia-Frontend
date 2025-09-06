export function BlogHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-soft-blue/10 via-mint-green/5 to-soft-coral/10 border-b border-border/50">
      <div className="absolute inset-0 opacity-5" />
      <div className="relative container mx-auto px-4 pt-16 pb-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-dark-slate-gray mb-4 text-balance pt-7">
          Discover the Future of
          <span className="block text-soft-blue">Healthcare</span>
        </h1>
        <p className="text-xl md:text-2xl text-cool-gray max-w-3xl mx-auto leading-relaxed">
          Stay ahead with cutting-edge research, expert insights, and breakthrough discoveries from the world&apos;s leading
          medical professionals.
        </p>
      </div>
    </div>
  )
}
