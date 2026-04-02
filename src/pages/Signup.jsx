import { Link } from 'react-router-dom'

export default function Signup() {
  function handleSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') || '')
    const email = String(form.get('email') || '')
    console.log({ name, email })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">It takes less than a minute.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="text-field">
            <span className="field-label">Name</span>
            <input name="name" type="text" placeholder="Your name" required />
          </label>

          <label className="text-field">
            <span className="field-label">Email</span>
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>

          <label className="text-field">
            <span className="field-label">Password</span>
            <input name="password" type="password" placeholder="Create a password" required />
          </label>

          <button type="submit" className="submit-btn">
            Sign up
          </button>
        </form>

        <p className="auth-foot">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
        <p className="auth-foot">
          <Link to="/">Back to home</Link>
        </p>
      </div>
    </div>
  )
}
