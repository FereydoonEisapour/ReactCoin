import { useState, useEffect } from 'react'
const useDarkMode = () => {
    const [theme, setTheme] = useState('light')
    const toggleTheme = () => {
        
        if (theme === 'light') {
            window.localStorage.setItem('theme', 'dark')
            document.documentElement.classList.add('dark');
            setTheme('dark')
        }
        else {
            window.localStorage.setItem('theme', 'light')
            document.documentElement.classList.remove('dark');
            setTheme('light')
        }
    }
    useEffect(() => {
        const localTheme = window.localStorage.getItem('theme')
        if (localTheme) { setTheme(localTheme) }
        if (localTheme === "dark") document.documentElement.classList.add('dark')
    }, [])


    return [theme, toggleTheme]
}
export default useDarkMode