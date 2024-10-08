const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.BUNDLE_ANALYZER === 'true',
});

const withRoutes = require('nextjs-routes/config')({
  outDir: 'nextjs',
});

// const headers = require('./nextjs/headers');
const redirects = require('./nextjs/redirects');
const rewrites = require('./nextjs/rewrites');

/** @type {import('next').NextConfig} */
const moduleExports = {
  transpilePackages: [
    'react-syntax-highlighter',
    'swagger-client',
    'swagger-ui-react',
  ],
  reactStrictMode: true,
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
      }),
    );
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: [ '@svgr/webpack' ],
      },
    );
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    return config;
  },
  // NOTE: all config functions should be static and not depend on any environment variables
  // since all variables will be passed to the app only at runtime and there is now way to change Next.js config at this time
  // if you are stuck and strongly believe what you need some sort of flexibility here please fill free to join the discussion
  // https://github.com/blockscout/frontend/discussions/167
  rewrites,
  redirects,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: generateCSP(),
          },
        ],
      },
    ];
  },
  output: 'standalone',
  productionBrowserSourceMaps: true,
  experimental: {
    instrumentationHook: process.env.NEXT_OPEN_TELEMETRY_ENABLED === 'true',
    // disabled as it is not stable yet
    // turbo: {
    //   rules: {
    //     '*.svg': {
    //       loaders: [ '@svgr/webpack' ],
    //       as: '*.js',
    //     },
    //   },
    // },
  },
};

function generateCSP() {
  // const scriptSrc = process.env.NEXT_PUBLIC_CSP_SCRIPT_SRC || '\'self\' \'unsafe-inline\' \'unsafe-eval\'';
  // const connectSrc = process.env.NEXT_PUBLIC_CSP_CONNECT_SRC || '\'self\'';

  // return `
  //   default-src 'self';
  //   script-src ${ scriptSrc };
  //   connect-src ${ connectSrc };
  //   style-src 'self' 'unsafe-inline';
  //   img-src 'self' data: https:;
  //   font-src 'self';
  //   object-src 'none';
  //   base-uri 'self';
  //   form-action 'self';
  //   frame-ancestors 'none';
  //   block-all-mixed-content;
  //   upgrade-insecure-requests;
  // `.replace(/\s{2,}/g, ' ').trim();

  return `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data:;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
      `.replace(/\n/g, '');

}

module.exports = withBundleAnalyzer(withRoutes(moduleExports));
