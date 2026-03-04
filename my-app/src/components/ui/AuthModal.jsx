import { useState, useEffect, useRef } from 'react'
import useStore from '../../store/useStore'

/**
 * &#1052;&#1086;&#1076;&#1072;&#1083;&#1100;&#1085;&#1086;&#1077; &#1086;&#1082;&#1085;&#1086; &#1072;&#1074;&#1090;&#1086;&#1088;&#1080;&#1079;&#1072;&#1094;&#1080;&#1080; / &#1088;&#1077;&#1075;&#1080;&#1089;&#1090;&#1088;&#1072;&#1094;&#1080;&#1080;
 * Props:
 *   open    {boolean}  &#1074;&#1080;&#1076;&#1080;&#1084;&#1086;&#1089;&#1090;&#1100;
 *   onClose {function} &#1079;&#1072;&#1082;&#1088;&#1099;&#1090;&#1100;
 */
function AuthModal({ open, onClose }) {
  const [tab, setTab]           = useState('login')   // 'login' | 'register'
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [ok, setOk]             = useState('')

  const login    = useStore(s => s.login)
  const register = useStore(s => s.register)

  const firstRef = useRef(null)

  // &#1060;&#1086;&#1082;&#1091;&#1089; &#1087;&#1088;&#1080; &#1086;&#1090;&#1082;&#1088;&#1099;&#1090;&#1080;&#1080;
  useEffect(() => {
    if (open) {
      setError(''); setOk('')
      setTimeout(() => firstRef.current?.focus(), 50)
    }
  }, [open, tab])

  // &#1047;&#1072;&#1082;&#1088;&#1099;&#1090;&#1080;&#1077; &#1087;&#1086; Esc
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  if (!open) return null

  function reset() {
    setName(''); setEmail(''); setPassword(''); setConfirm(''); setError(''); setOk('')
  }

  function switchTab(t) { setTab(t); reset() }

  function handleLogin(e) {
    e.preventDefault()
    setError(''); setOk('')
    const err = login(email.trim(), password)
    if (err) { setError(err); return }
    setOk('\u0412\u044b \u0443\u0441\u043f\u0435\u0448\u043d\u043e \u0432\u043e\u0448\u043b\u0438!')
    setTimeout(() => { reset(); onClose() }, 900)
  }

  function handleRegister(e) {
    e.preventDefault()
    setError(''); setOk('')
    if (!name.trim()) { setError('\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043c\u044f'); return }
    if (password.length < 4) { setError('\u041f\u0430\u0440\u043e\u043b\u044c \u043c\u0438\u043d\u0438\u043c\u0443\u043c 4 \u0441\u0438\u043c\u0432\u043e\u043b\u0430'); return }
    if (password !== confirm) { setError('\u041f\u0430\u0440\u043e\u043b\u0438 \u043d\u0435 \u0441\u043e\u0432\u043f\u0430\u0434\u0430\u044e\u0442'); return }
    const err = register(name.trim(), email.trim(), password)
    if (err) { setError(err); return }
    setOk('\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f \u0443\u0441\u043f\u0435\u0448\u043d\u0430!')
    setTimeout(() => { reset(); onClose() }, 900)
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">

        {/* &#1047;&#1072;&#1075;&#1086;&#1083;&#1086;&#1074;&#1086;&#1082; */}
        <div className="auth-modal-head">
          <h2 className="auth-title">
            {tab === 'login' ? '🔒 Вход в аккаунт' : '🔓 Регистрация'}
          </h2>
          <button className="auth-close" onClick={onClose} aria-label="&#1047;&#1072;&#1082;&#1088;&#1099;&#1090;&#1100;">&#10005;</button>
        </div>

        {/* &#1058;&#1072;&#1073;&#1099; */}
        <div className="auth-tabs">
          <button
            className={`auth-tab${tab === 'login' ? ' auth-tab--active' : ''}`}
            onClick={() => switchTab('login')}
          >&#1042;&#1086;&#1081;&#1090;&#1080;</button>
          <button
            className={`auth-tab${tab === 'register' ? ' auth-tab--active' : ''}`}
            onClick={() => switchTab('register')}
          >&#1047;&#1072;&#1088;&#1077;&#1075;&#1080;&#1089;&#1090;&#1088;&#1080;&#1088;&#1086;&#1074;&#1072;&#1090;&#1100;&#1089;&#1103;</button>
        </div>

        {/* &#1057;&#1086;&#1086;&#1073;&#1097;&#1077;&#1085;&#1080;&#1103; */}
        {error && <div className="auth-error">&#9888; {error}</div>}
        {ok    && <div className="auth-success">&#10004; {ok}</div>}

        {/* &#1060;&#1086;&#1088;&#1084;&#1072; &#1074;&#1093;&#1086;&#1076;&#1072; */}
        {tab === 'login' && (
          <form className="auth-form" onSubmit={handleLogin}>
            <label className="auth-label">
              <span>Email</span>
              <input
                ref={firstRef}
                className="auth-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="auth-label">
              <span>&#1055;&#1072;&#1088;&#1086;&#1083;&#1100;</span>
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                required
              />
            </label>
            <button className="btn btn-primary auth-submit" type="submit">&#1042;&#1086;&#1081;&#1090;&#1080;</button>
            <p className="auth-hint">
              &#1053;&#1077;&#1090; &#1072;&#1082;&#1082;&#1072;&#1091;&#1085;&#1090;&#1072;?{' '}
              <button type="button" className="auth-link" onClick={() => switchTab('register')}>
                &#1047;&#1072;&#1088;&#1077;&#1075;&#1080;&#1089;&#1090;&#1088;&#1080;&#1088;&#1091;&#1081;&#1090;&#1077;&#1089;&#1100;
              </button>
            </p>
          </form>
        )}

        {/* &#1060;&#1086;&#1088;&#1084;&#1072; &#1088;&#1077;&#1075;&#1080;&#1089;&#1090;&#1088;&#1072;&#1094;&#1080;&#1080; */}
        {tab === 'register' && (
          <form className="auth-form" onSubmit={handleRegister}>
            <label className="auth-label">
              <span>&#1048;&#1084;&#1103;</span>
              <input
                ref={firstRef}
                className="auth-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="&#1048;&#1074;&#1072;&#1085; &#1055;&#1077;&#1090;&#1088;&#1086;&#1074;"
                required
              />
            </label>
            <label className="auth-label">
              <span>Email</span>
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="auth-label">
              <span>&#1055;&#1072;&#1088;&#1086;&#1083;&#1100;</span>
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="&#1084;&#1080;&#1085;&#1080;&#1084;&#1091;&#1084; 4 &#1089;&#1080;&#1084;&#1074;&#1086;&#1083;&#1072;"
                required
              />
            </label>
            <label className="auth-label">
              <span>&#1055;&#1086;&#1074;&#1090;&#1086;&#1088;&#1080;&#1090;&#1077; &#1087;&#1072;&#1088;&#1086;&#1083;&#1100;</span>
              <input
                className="auth-input"
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                required
              />
            </label>
            <button className="btn btn-primary auth-submit" type="submit">&#1047;&#1072;&#1088;&#1077;&#1075;&#1080;&#1089;&#1090;&#1088;&#1080;&#1088;&#1086;&#1074;&#1072;&#1090;&#1100;&#1089;&#1103;</button>
            <p className="auth-hint">
              &#1059;&#1078;&#1077; &#1077;&#1089;&#1090;&#1100; &#1072;&#1082;&#1082;&#1072;&#1091;&#1085;&#1090;?{' '}
              <button type="button" className="auth-link" onClick={() => switchTab('login')}>
                &#1042;&#1086;&#1081;&#1090;&#1080;
              </button>
            </p>
          </form>
        )}

      </div>
    </div>
  )
}

export default AuthModal
