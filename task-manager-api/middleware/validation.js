const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

const validateRegister = (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  next();
};

const validateTaskInput = (req, res, next) => {
  const { title } = req.body || {};

  // For POST requests, title is mandatory
  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required and cannot be empty.' });
    }
  }

  // For PUT requests, if title is provided, it must be valid string and non-empty
  if (req.method === 'PUT' && title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Task title must be a non-empty string.' });
    }
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateTaskInput,
};
