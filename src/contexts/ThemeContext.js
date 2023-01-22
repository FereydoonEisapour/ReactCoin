import React from "react";

const ThemeStateContext = React.createContext();
const AuthDispatchContext = React.createContext();

function reducer(currentState, newState) {
    return { ...currentState, ...newState };
}
function useThemeState() {
    const context = React.useContext(ThemeStateContext);
    if (!context) throw new Error("useThemeState must be used in ThemeProvider");
    return context;
}

function useThemeDispatch() {
    const context = React.useContext(AuthDispatchContext);
    if (!context) throw new Error("useThemeDispatch must be used in ThemeProvider");
    return context;
}
const initialState = {
    theme: 'light',
};

function ThemeProvider(props) {
    const [state, dispatchTheme] = React.useReducer(reducer, initialState);
    return (
        <ThemeStateContext.Provider value={state}>
            <AuthDispatchContext.Provider value={dispatchTheme}>{props.children}</AuthDispatchContext.Provider>
        </ThemeStateContext.Provider>
    );
}
function changeTheme(dispatchTheme, theme) {
   
    if (theme === 'light') {
        dispatchTheme({ theme: 'dark' })
        window.localStorage.setItem('theme', 'dark')
    }
    if (theme === 'dark') {
        dispatchTheme({ theme: 'light' })
        window.localStorage.setItem('theme', 'light')
    }
}

export { ThemeProvider, useThemeState, useThemeDispatch, changeTheme };

