const nextConfig = {
  async redirects() {
    return [
      {
        source: "/hackbama1/register",
        destination: "https://forms.gle/UFuFeUP9cd6p68th9",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
