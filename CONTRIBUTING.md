# Contributing to Prysm

Thank you for your interest in contributing to Prysm!

## How to Contribute

### Reporting Issues

- Check if the issue already exists in the [issue tracker](https://github.com/manasdutta04/prysm/issues)
- Use a clear and descriptive title
- Provide detailed steps to reproduce the issue
- Include screenshots if applicable
- Specify your environment (OS, browser, Node version, etc.)

### Submitting Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/manasdutta04/prysm.git
   cd prysm
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments where necessary
   - Test your changes thoroughly

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: brief description of your changes"
   ```
   
   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Provide a clear description of your changes
   - Link any related issues

### Development Setup

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
npm install
npm start
```

### Code Style Guidelines

- Use meaningful variable and function names
- Keep functions small and focused
- Write self-documenting code
- Use ES6+ features where appropriate
- Follow React best practices (hooks, functional components)
- Use Tailwind CSS for styling when possible

### Testing

- Test your changes in both development and production builds
- Ensure all existing features still work
- Test on different browsers if making UI changes
- Verify responsive design on mobile devices

### Documentation

- Update README.md if you add new features
- Add JSDoc comments for complex functions
- Update API documentation if you modify endpoints

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or insulting/derogatory comments
- Publishing others' private information
- Any conduct that would be inappropriate in a professional setting

## Questions?

If you have questions, feel free to:
- Open an issue for discussion
- Reach out to the maintainers
- Join our community discussions

## License

By contributing to Prysm, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Prysm! 
