module.exports = {
  apps: [
    {
      name: 'frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_API_URL: 'http://localhost:3001'
      },
      instances: 1,
      watch: false,
      merge_logs: true
    },
    {
      name: 'backend',
      cwd: './backend',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
        DATABASE_URL: 'postgresql://user:password@localhost:5432/josias',
        AI_SERVICE_URL: 'http://localhost:8000',
        REDIS_HOST: 'localhost',
        REDIS_PORT: 6379,
        OPENAI_API_KEY: 'your-openai-api-key-here'
      },
      instances: 1,
      watch: false,
      merge_logs: true,
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log'
    }
  ]
};
