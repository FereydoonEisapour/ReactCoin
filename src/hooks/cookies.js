import Cookie from 'js-cookie';

const setCookie = (cookiename, user) => {
    Cookie.set(cookiename, user, {
        expires: 10, // 10 day
        secure: true,
        sameSite: 'strict',
        path: '/'
    })
}
const getCookie = (cookiename) => {
   return Cookie.get(cookiename)
}

const removeCookie = (cookiename, user) => {
    Cookie.remove(cookiename)
}
export { removeCookie, setCookie, getCookie };

