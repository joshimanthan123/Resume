const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CI/CD Task API running on http://0.0.0.0:${PORT}`);
  console.log(`📋 Practical 12: CI/CD Pipeline with GitHub Actions`);
});
