/** @type {import('next').NextConfig} */
module.exports = {
  // https://stackoverflow.com/questions/72399203/google-fonts-not-loading
  optimizeFonts: false,
  reactStrictMode: true,
  images: {
    domains: [
      'res.cloudinary.com',
      'avatars.githubusercontent.com',
      'lh0.googleusercontent.com',
      'lh1.googleusercontent.com',
      'lh2.googleusercontent.com',
      'lh3.googleusercontent.com',
      'lh4.googleusercontent.com',
      'lh5.googleusercontent.com',
      'lh6.googleusercontent.com',
      'lh7.googleusercontent.com',
      'lh8.googleusercontent.com',
      'lh9.googleusercontent.com',
    ],
  },
  async redirects() {
    return [
      {
        source: '/post/:slug',
        destination: '/certificate/:slug',
        permanent: true,
      },
    ]
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        path: false,
        os: false,
        child_process: false,
        net: false,
        tls: false,
        perf_hooks: false,
        async_hooks: false,
        console: false,
        'stream/web': false,
        'util/types': false,
      },
    }
    return config
  },
}
