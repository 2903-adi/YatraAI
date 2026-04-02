import { Link } from 'react-router-dom'

export default function Login() {
  function handleSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email') || '')
    console.log({ email })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Log in to keep your trips in one place.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="text-field">
            <span className="field-label">Email</span>
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>

          <label className="text-field">
            <span className="field-label">Password</span>
            <input name="password" type="password" placeholder="••••••••" required />
          </label>

          <button type="submit" className="submit-btn">
            Log in
          </button>
        </form>

        <p className="auth-foot">
          New here? <Link to="/signup">Create an account</Link>
        </p>
        <p className="auth-foot">
          <Link to="/">Back to home</Link>
        </p>
      </div>
    </div>
  )
}
