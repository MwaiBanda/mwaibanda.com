import { Download, Github, Linkedin, Mail, Moon, Sun } from 'lucide-react'
import { useTheme } from './theme-provider'
import './action-bar.css'

export default function ActionBar() {
    const { theme, setTheme } = useTheme()
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    const themeLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode'

    return <nav className="action-bar-position" aria-label="Connect and appearance">
        <div className="action-bar-glass action-bar-surface">
            <div className="action-bar-items">
                <a href="https://github.com/MwaiBanda" target="_blank" rel="noopener noreferrer" className="glass-control" aria-label="GitHub" data-tooltip="GitHub">
                    <Github size={18} aria-hidden="true" />
                </a>
                <a href="https://www.linkedin.com/in/mwai-banda/" target="_blank" rel="noopener noreferrer" className="glass-control" aria-label="LinkedIn" data-tooltip="LinkedIn">
                    <Linkedin size={18} aria-hidden="true" />
                </a>
                <a href="mailto:bandamwai@gmail.com" className="glass-control" aria-label="Email" data-tooltip="Email">
                    <Mail size={18} aria-hidden="true" />
                </a>
                <a href="/resume.pdf" download="Resume.pdf" className="glass-control" aria-label="Download resume" data-tooltip="Resume">
                    <Download size={18} aria-hidden="true" />
                </a>
                <span className="glass-divider" aria-hidden="true" />
                <button type="button" className="glass-control" aria-label={themeLabel} data-tooltip={themeLabel} onClick={() => setTheme(isDark ? 'light' : 'dark')}>
                    {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
                </button>
            </div>
        </div>
    </nav>
}